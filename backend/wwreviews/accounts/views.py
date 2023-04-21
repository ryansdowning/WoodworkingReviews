import uuid

import praw
from django.conf import settings
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Member
from accounts.serializers import MemberSerializer
from wwreviews.utils import ReadOnlyIsAuthenticatedView


class MemberView(ReadOnlyIsAuthenticatedView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["user", "reddit_username"]

    def get_queryset(self):
        if self.request is None:
            return self.queryset.none()
        if self.request.user.member is None:
            return self.queryset.none()
        return self.queryset.filter(user=self.request.user)


class RedditAuthView(APIView):
    def get(self, request):
        state = str(uuid.uuid4())
        redirect_url = settings.REDDIT_CLIENT.auth.url(scopes=["identity"], state=state, duration="permanent")
        request.session["reddit_state"] = state
        return redirect(redirect_url)


class RedditCallbackView(APIView):
    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state")
        if state != request.session.get("reddit_state"):
            return Response({"state": ["state does not match."]}, status=status.HTTP_400_BAD_REQUEST)

        user_client = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            redirect_uri=settings.REDDIT_REDIRECT_URL,
            user_agent=settings.REDDIT_USER_AGENT,
        )
        refresh_token = user_client.auth.authorize(code)
        username = user_client.user.me().name

        member_query = Member.objects.filter(reddit_username=username)
        if member_query.exists():
            member = member_query.get()
            member.reddit_refresh_token = refresh_token
            member.save()
            token = Token.objects.get(user=member.user)
        else:
            user = User.objects.create(username=username, password=str(uuid.uuid4()))
            token = Token.objects.create(user=user)
            member = Member.objects.create(user=user, reddit_username=username, reddit_refresh_token=refresh_token)

        return redirect(f"{settings.FE_URL}login?token={token.key}")
