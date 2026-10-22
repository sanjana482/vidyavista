from django.conf import settings
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.utils import timezone
from django.views.static import serve
from rest_framework_simplejwt.views import TokenBlacklistView, TokenRefreshView, TokenVerifyView

from core.api import LoginView, MeView


def health(_request):
    return JsonResponse({"ok": True, "time": timezone.now().isoformat()})


# every API route accepts an optional trailing slash, so the Next.js frontend can call /api/schools or /api/schools/
urlpatterns = [
    path(settings.ADMIN_PATH, admin.site.urls),
    re_path(r"^api/health/?$", health),
    re_path(r"^api/auth/token/?$", LoginView.as_view()),  # login: {username, password} -> {access, refresh}
    re_path(r"^api/auth/token/refresh/?$", TokenRefreshView.as_view()),  # rotates the refresh token
    re_path(r"^api/auth/token/verify/?$", TokenVerifyView.as_view()),
    re_path(r"^api/auth/logout/?$", TokenBlacklistView.as_view()),  # blacklists a refresh token
    re_path(r"^api/auth/me/?$", MeView.as_view()),
    path("api/", include("schools.urls")),
    path("api/", include("enquiries.urls")),
    # uploaded school photos (use a Railway Volume for MEDIA_ROOT, or switch to S3/Cloudinary later)
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
