# Generated by Django 4.1.7 on 2023-04-12 17:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="member",
            name="reddit_username",
            field=models.TextField(unique=True),
        ),
        migrations.AlterField(
            model_name="member",
            name="user",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
