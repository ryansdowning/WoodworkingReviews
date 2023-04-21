from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models

from wwreviews.utils import TrackedMixin


class Category(models.Model):
    name = models.TextField(unique=True)
    parent = models.ForeignKey("Category", on_delete=models.CASCADE, null=True, blank=True)

    def get_children(self) -> list["Category"]:
        return list(Category.objects.filter(parent=self))


class AbstractProduct(TrackedMixin, models.Model):
    name = models.TextField()
    price = models.FloatField()
    link = models.URLField()
    image_url = models.URLField()

    class Meta:
        abstract = True


class SuggestedProduct(AbstractProduct):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.TextField(null=True, blank=True)


class Product(AbstractProduct):
    category = models.ForeignKey(Category, on_delete=models.PROTECT)


class ProductAction(TrackedMixin, models.Model):
    class Action(models.IntegerChoices):
        NAME_UPDATED = 1
        PRICE_UPDATED = 2
        LINK_UPDATED = 3
        IMAGE_UPDATED = 4
        CATEGORY_UDPATED = 5

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    action = models.SmallIntegerField(choices=Action.choices)
    details = models.JSONField(blank=True, default=dict)


def validate_rating(rating: int):
    """
    Validates that the rating is between 0 and 5, or is None.

    Args:
         rating: Rating value from Rating model.
    """
    if not 0 <= rating <= 5:
        raise ValidationError(f"Rating must be an integer between 0 and 5, got {rating}.")


class Rating(TrackedMixin, models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    value = models.SmallIntegerField(validators=[validate_rating])

    class Meta:
        unique_together = ("product", "user")


class Feedback(TrackedMixin, models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    text = models.TextField()

    class Meta:
        unique_together = ("product", "user")
