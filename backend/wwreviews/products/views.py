from django_filters import BaseInFilter, BooleanFilter, FilterSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from accounts.models import Member
from products.models import Category, Feedback, Product, ProductAction, Rating, SuggestedProduct
from products.serializers import (BasicProductReviewSerializer, CategorySerializer, FeedbackSerializer,
                                  ProductActionSerializer, ProductSerializer, RatingSerializer,
                                  SuggestedProductSerializer)
from wwreviews.utils import (READ_ACTIONS, CreateUserFieldMixin, DisablePutMixin, IsAuthenticatedView,
                             UnauthenticatedReadMixin)


class SuggestedProductView(CreateUserFieldMixin, IsAuthenticatedView):
    queryset = SuggestedProduct.objects.all()
    serializer_class = SuggestedProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = []

    def get_queryset(self):
        if self.request is None or self.request.user is None:
            return self.queryset.none()
        if self.request.user.member.role == Member.Role.MODERATOR:
            return self.queryset
        return self.queryset.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class ProductFilter(FilterSet):
    class Meta:
        model = Product
        fields = {
            "name": ["exact", "startswith", "contains", "icontains"],
            "price": ["exact", "gte", "lte"],
            "link": ["exact"],
        }


class ProductView(UnauthenticatedReadMixin, DisablePutMixin, ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        if self.request is None:
            return self.queryset.none()
        if self.action in READ_ACTIONS:
            return self.queryset
        if self.request.user is not None and self.request.user.member.role == Member.Role.MODERATOR:
            return self.queryset
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        if self.request.user is None or self.request.user.member.role != Member.Role.MODERATOR:
            return Response(
                {"message": "You are not authorized to create a 'Product' resource."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer, *args, **kwargs):
        instance = serializer.save()
        if serializer.partial:
            if serializer.instance.name != instance.name:
                ProductAction.objects.create(
                    product=instance,
                    action=ProductAction.Action.NAME_UPDATED,
                    details={"prev": serializer.instance.name, "curr": instance.name},
                )
            if serializer.instance.price != instance.price:
                ProductAction.objects.create(
                    product=instance,
                    action=ProductAction.Action.PRICE_UPDATED,
                    details={"prev": serializer.instance.price, "curr": instance.price},
                )
            if serializer.instance.link != instance.link:
                ProductAction.objects.create(
                    product=instance,
                    action=ProductAction.Action.LINK_UPDATED,
                    details={"prev": serializer.instance.link, "curr": instance.link},
                )
            if serializer.instance.image_url != instance.image_url:
                ProductAction.objects.create(
                    product=instance,
                    action=ProductAction.Action.IMAGE_UPDATED,
                    details={"prev": serializer.instance.link, "curr": instance.link},
                )

        return super().perform_update(serializer, *args, **kwargs)


class ProductActionView(UnauthenticatedReadMixin, ModelViewSet):
    queryset = ProductAction.objects.all()
    serializer_class = ProductActionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product", "action", "link"]

    def get_queryset(self):
        if self.request is None:
            return self.queryset.none()
        if self.action in READ_ACTIONS:
            return self.queryset
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        return Response(
            {"message": "You are not authorized to create a 'ProductAction' resource."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class CategoryFilter(FilterSet):
    no_parent = BooleanFilter(field_name="parent", lookup_expr="isnull")

    class Meta:
        model = Category
        fields = ("name", "parent", "no_parent")


class CategoryView(UnauthenticatedReadMixin, ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CategoryFilter

    def get_queryset(self):
        if self.request is None:
            return self.queryset.none()
        if self.action in READ_ACTIONS:
            return self.queryset
        if self.request.user is not None and self.request.user.member.role == Member.Role.MODERATOR:
            return self.queryset
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        if self.request.user is None or self.request.user.member.role != Member.Role.MODERATOR:
            return Response(
                {"message": "You are not authorized to create a 'Category' resource."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return super().create(request, *args, **kwargs)


class RatingView(CreateUserFieldMixin, UnauthenticatedReadMixin, ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product", "user", "value"]

    def get_queryset(self):
        if self.request is None:
            return self.queryset.none()
        if self.action in READ_ACTIONS:
            return self.queryset
        if self.request.user is not None and self.request.user.member.role == Member.Role.MODERATOR:
            return self.queryset
        return self.queryset.filter(user=self.request.user)


class FeedbackView(CreateUserFieldMixin, UnauthenticatedReadMixin, ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product", "user", "text"]

    def get_queryset(self):
        if self.request is None:
            return self.queryset.none()
        if self.action in READ_ACTIONS:
            return self.queryset
        if self.request.user is not None and self.request.user.member.role == Member.Role.MODERATOR:
            return self.queryset
        return self.queryset.filter(user=self.request.user)


class BasicProductReviewFilter(FilterSet):
    ids = BaseInFilter(field_name="id")

    class Meta:
        model = Product
        fields = ("ids",)


class BasicProductReviewView(ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = BasicProductReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BasicProductReviewFilter
