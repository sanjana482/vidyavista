from celery import shared_task
from django.core.management import call_command


@shared_task
def flush_expired_tokens():
    """Deletes expired rows from the JWT blacklist tables."""
    call_command("flushexpiredtokens")
