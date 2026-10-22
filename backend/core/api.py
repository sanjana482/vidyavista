from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView, exception_handler as drf_exception_handler
from rest_framework_simplejwt.views import TokenObtainPairView


def exception_handler(exc, context):
    """Same error shape as the old API: {"message": "...", "errors": {...}}."""
    response = drf_exception_handler(exc, context)
    if response is not None and isinstance(response.data, dict) and "detail" in response.data:
        response.data = {"message": str(response.data["detail"])}
    return response


class LoginView(TokenObtainPairView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"


class MeView(APIView):
    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"message": "Authentication credentials were not provided."}, status=401)
        u = request.user
        return Response({"id": u.pk, "username": u.get_username(), "email": u.email, "isStaff": u.is_staff})
