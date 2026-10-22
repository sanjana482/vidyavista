import logging
import re

from django.db import transaction
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle, ScopedRateThrottle
from rest_framework.views import APIView

from schools.models import School

from .models import Enquiry
from .tasks import notify_new_enquiry

logger = logging.getLogger(__name__)


def clean(value, limit=200):
    return value.strip()[:limit] if isinstance(value, str) else ""


class EnquiryCreateView(APIView):
    """POST /api/enquiries  (public). Max 10 per hour per IP."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "enquiry"

    def post(self, request):
        b = request.data if hasattr(request.data, "get") else {}
        errors = {}

        parent_name = clean(b.get("parentName"), 80)
        mobile = re.sub(r"\D", "", clean(b.get("mobile"), 15))[-10:]
        school_name = clean(b.get("schoolName"), 150)
        email = clean(b.get("email"), 120).lower()

        if len(parent_name) < 2:
            errors["parentName"] = "Parent name is required"
        if not re.fullmatch(r"[6-9]\d{9}", mobile):
            errors["mobile"] = "Enter a valid 10-digit mobile number"
        if not school_name:
            errors["schoolName"] = "School is required"
        if email and not re.fullmatch(r"\S+@\S+\.\S+", email):
            errors["email"] = "Enter a valid email"
        if errors:
            return Response({"message": "Validation failed", "errors": errors}, status=422)

        # link to the School row when we can (by id first, then by exact name)
        school = None
        try:
            school = School.objects.filter(pk=int(b.get("schoolId"))).first()
        except (TypeError, ValueError):
            pass
        school = school or School.objects.filter(name__iexact=school_name).first()

        pref = b.get("preference") if isinstance(b.get("preference"), dict) else {}
        enquiry = Enquiry.objects.create(
            school=school,
            school_name=school_name,
            child_name=clean(b.get("childName"), 80),
            class_name=clean(b.get("className"), 30),
            session=clean(b.get("session"), 20),
            parent_name=parent_name,
            relation=clean(b.get("relation"), 30),
            mobile=mobile,
            email=email,
            city=clean(b.get("city"), 60),
            note=clean(b.get("note"), 500),
            source=clean(b.get("source"), 200),
            preference_type=clean(pref.get("type"), 40),
            preference_location=clean(pref.get("location"), 60),
            ip=BaseThrottle().get_ident(request) or None,
        )

        def queue():
            try:
                notify_new_enquiry.delay(enquiry.pk)
            except Exception as exc:  # a down broker must not lose the enquiry
                logger.warning("Could not queue enquiry email: %s", exc)

        transaction.on_commit(queue)
        return Response({"message": "Enquiry received", "id": enquiry.pk}, status=201)
