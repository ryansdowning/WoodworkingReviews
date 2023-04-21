from django.contrib.auth.models import User
from django.db import models


class Member(models.Model):
    class Role(models.IntegerChoices):
        USER = 1
        MODERATOR = 2

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.SmallIntegerField(blank=True, choices=Role.choices, default=Role.USER)
    reddit_username = models.TextField(unique=True)
    reddit_refresh_token = models.TextField()
