from django.urls import include, path
from rest_framework.routers import DefaultRouter

from accounts.views import MemberView, RedditAuthView, RedditCallbackView

router = DefaultRouter()
router.register("member", MemberView)

urlpatterns = [
    path("", include(router.urls)),
    path("reddit-auth/", RedditAuthView.as_view()),
    path("reddit-callback/", RedditCallbackView.as_view()),
]
