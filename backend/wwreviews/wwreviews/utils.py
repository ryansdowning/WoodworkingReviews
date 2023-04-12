from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from django.http import QueryDict
from django.db import models
from typing import Literal, Any

READ_ACTIONS = {"retrieve", "list"}


def validate(
    serializer, request, partial: bool = False
) -> tuple[Literal[False], Response] | tuple[Literal[True], dict]:
    """
    Validates user request data using the serializer.

    Args:
        serializer: Serializer for the type of object being processed.
        request: Django request object.
        partial: If true, allows for partial serialized requests (used for PATCH requests).
    """
    serializer = serializer(data=request.data, partial=partial)

    if not serializer.is_valid():
        return False, Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    validated_data = serializer.validated_data

    return True, validated_data


def safe_set_querydict(querydict: QueryDict, key: Any, value: Any) -> QueryDict:
    """
    Safely sets or updates a key in a QueryDict by handling the mutability attribute of the QueryDict.

    Args:
        querydict: The querydict object to set or update the key of.
        key: The key to update in the querydict.
        value: The value to set/update the key to.

    Returns:
        Reference to the updated querydict.
    """
    # pylint: disable=W0212
    is_mutable = querydict._mutable
    querydict._mutable = True
    querydict[key] = value
    querydict._mutable = is_mutable
    return querydict


class IsAuthenticatedMixin:
    """
    Mixin for a view that requires a user to be authenticated.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]


class IsAuthenticatedView(IsAuthenticatedMixin, ModelViewSet):
    """
    Default CRUD API that requires a user to be authenticated.
    """


class CreateOnlyIsAuthenticatedView(IsAuthenticatedMixin, CreateAPIView):
    """
    Default create-only API that requires a user to be authenticated.
    """


class ReadOnlyIsAuthenticatedView(IsAuthenticatedMixin, ReadOnlyModelViewSet):
    """
    Default read-only API that requires a user to be authenticated.
    """


class UnauthenticatedReadMixin:
    """
    Mixin to allow READ operations.
    """

    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        """
        Gets the permissions for this class. Allows READ operations.
        """
        if self.action in ["retrieve", "list"]:
            return [AllowAny()]
        return [IsAuthenticated()]


class CreateOrganizationFieldMixin:
    """
    Mixin which overrides the create method to guarantee the resource is created with the organization field set to the
    requesting user.
    """

    def create(self, request, *args, **kwargs):
        """
        Validates that the organization provided in the post request, if any, matches the organization the request is
        from. If the organization is not provided in the request, the validation is skipped and the requesting
        organization is set appropriately.
        """
        if request.user.member is None:
            return Response(
                {
                    "organization": [
                        f"You must be part of an organization to create a '{self.serializer_class.Meta.model}' resource."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        success, response = validate(self.serializer_class, request, partial=True)

        if not success:
            return response

        validated_data = response
        if "organization" in validated_data:
            # Remove organization from the dictionary and validate that it is the same as the requesting organization.
            if validated_data.pop("organization") != request.user.member.organization:
                return Response(
                    {
                        "organization": [
                            f"Cannot create a '{self.serializer_class.Meta.model}' resource for an "
                            "organization other than your own. This field does not need to be specified."
                        ]
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        safe_set_querydict(request.POST, "organization", request.user.member.organization.pk)
        return super().create(request, *args, **kwargs)


class CreatedAtMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class UpdatedAtMixin(models.Model):
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TrackedMixin(CreatedAtMixin, UpdatedAtMixin):
    """ """

    class Meta:
        abstract = True
