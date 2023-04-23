from django.urls import include, path
from rest_framework.routers import DefaultRouter

from products.views import (BasicProductReviewView, CategoryView, FeedbackView, ProductActionView, ProductView,
                            RatingView, SuggestedProductView)

router = DefaultRouter()
router.register("product", ProductView)
router.register("suggested-product", SuggestedProductView)
router.register("product-action", ProductActionView)
router.register("category", CategoryView)
router.register("rating", RatingView)
router.register("feedback", FeedbackView)
router.register("basic-product-review", BasicProductReviewView)

urlpatterns = [
    path("", include(router.urls)),
]
