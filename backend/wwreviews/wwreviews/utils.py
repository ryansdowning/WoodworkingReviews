from typing import Any, Literal

from django.db import models
from django.http import QueryDict
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

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
        if self.action in READ_ACTIONS:
            return [AllowAny()]
        return [IsAuthenticated()]


class DisablePutMixin:
    """
    Mixin for disabling PUT requests for a ModelViewSet.
    """

    def update(self, request, *args, **kwargs):
        """
        Overrides to disable PUT operations for this view.
        """
        if request.method == "PUT":
            return Response(
                {"message": "PUT requests are disabled for this endpoint."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
            )
        return super().update(request, *args, **kwargs)


class DisablePatchMixin:
    """
    Mixin for disabling PATCH requests for a ModelViewSet.
    """

    # pylint: disable=R0201
    def partial_update(self, request, *args, **kwargs):
        """
        Overrides to disable PUT operations for this view.
        """
        return Response(
            {"message": "PATCH requests are disabled for this endpoint."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )


class CreateUserFieldMixin:
    """
    Mixin which overrides the create method to guarantee the resource is created with the user field set to the
    requesting user.
    """

    def create(self, request, *args, **kwargs):
        """
        Validates that the user provided in the post request, if any, matches the user the request is from. If the user
        is not provided in the request, the validation is skipped and the requesting user is set appropriately.
        """
        request.POST._mutable = True
        if "user" in request.POST:
            # Remove user from the dictionary and validate that it is the same as the requesting user.
            if request.POST.pop("user") != request.user:
                return Response(
                    {
                        "user": f"Cannot create a '{self.serializer_class.Meta.model}' resource for a user other than "
                        "yourself. This field does not need to be specified."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        request.POST["user"] = request.user.pk
        request.POST._mutable = False
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
