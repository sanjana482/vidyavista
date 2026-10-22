from django.core.management.base import BaseCommand

from schools import search
from schools.models import School


class Command(BaseCommand):
    help = "Creates / refreshes the Meilisearch 'schools' index from the database."

    def handle(self, *args, **options):
        if not search._client():
            self.stdout.write(self.style.WARNING("MEILISEARCH_URL is not set - nothing to do."))
            return
        n = search.reindex_all(School.objects.all())
        self.stdout.write(self.style.SUCCESS(f"Indexed {n} schools in Meilisearch"))
