import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("vidyavista")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# Only used if you also run `celery -A config beat` (optional): clears expired JWT blacklist rows daily.
app.conf.beat_schedule = {
    "flush-expired-jwt-tokens": {"task": "core.tasks.flush_expired_tokens", "schedule": crontab(hour=3, minute=30)},
}
