import logging

from django.core.cache import cache
from django.db import transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import School

logger = logging.getLogger(__name__)
CACHE_KEYS = ["schools:meta", "schools:sitemap"]


def _safe_delay(task, pk):
    try:
        task.delay(pk)
    except Exception as exc:  # broker down must never break saving in the admin
        logger.warning("Could not queue %s: %s", getattr(task, "name", task), exc)


@receiver(post_save, sender=School)
def school_saved(sender, instance, **kwargs):
    from .tasks import index_school

    cache.delete_many(CACHE_KEYS)
    transaction.on_commit(lambda: _safe_delay(index_school, instance.pk))


@receiver(post_delete, sender=School)
def school_deleted(sender, instance, **kwargs):
    from .tasks import remove_school

    cache.delete_many(CACHE_KEYS)
    pk = instance.pk
    transaction.on_commit(lambda: _safe_delay(remove_school, pk))
