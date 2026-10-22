import logging

from celery import shared_task

from . import search
from .models import School

logger = logging.getLogger(__name__)


@shared_task(autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def index_school(pk: int):
    school = School.objects.filter(pk=pk).first()
    if school:
        search.upsert(school)


@shared_task(autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def remove_school(pk: int):
    search.remove(pk)


@shared_task
def reindex_all_schools():
    n = search.reindex_all(School.objects.all())
    logger.info("Reindexed %s schools", n)
    return n
