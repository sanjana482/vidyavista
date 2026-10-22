import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


@shared_task(autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def notify_new_enquiry(enquiry_id: int):
    """Emails the team when a parent submits an enquiry (runs in the Celery worker)."""
    from .models import Enquiry

    recipients = settings.ENQUIRY_NOTIFY_EMAILS
    enquiry = Enquiry.objects.filter(pk=enquiry_id).first()
    if not recipients or not enquiry:
        return
    link = f"https://{settings.RAILWAY_DOMAIN}/{settings.ADMIN_PATH}enquiries/enquiry/{enquiry.pk}/change/" if settings.RAILWAY_DOMAIN else ""
    body = (
        f"New admission enquiry\n\n"
        f"School : {enquiry.school_name}\n"
        f"Parent : {enquiry.parent_name} ({enquiry.relation or 'parent'})\n"
        f"Mobile : {enquiry.mobile}\n"
        f"Email  : {enquiry.email or '-'}\n"
        f"Child  : {enquiry.child_name or '-'}  Class {enquiry.class_name or '-'}  Session {enquiry.session or '-'}\n"
        f"City   : {enquiry.city or '-'}\n"
        f"Message: {enquiry.note or '-'}\n\n"
        f"{link}"
    )
    send_mail(f"New enquiry: {enquiry.school_name}", body, settings.DEFAULT_FROM_EMAIL, recipients)
