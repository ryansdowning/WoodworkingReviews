from django.db.models import Avg
from rest_framework import serializers

from products.models import Category, Feedback, Product, ProductAction, Rating, SuggestedProduct


class SuggestedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestedProduct
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAction
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"


class BasicProductReviewSerializer(serializers.ModelSerializer):
    feedback_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ("id", "feedback_count", "average_rating", "rating_count")

    def get_feedback_count(self, obj):
        return obj.feedback_set.count()

    def get_average_rating(self, obj):
        return obj.rating_set.aggregate(avg_rating=Avg("value"))["avg_rating"]

    def get_rating_count(self, obj):
        return obj.rating_set.count()
