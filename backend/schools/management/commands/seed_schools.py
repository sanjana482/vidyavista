import json
from pathlib import Path

from django.core.management.base import BaseCommand

from schools.models import School


class Command(BaseCommand):
    help = "Adds the sample schools. Existing schools are skipped, so it is safe to run again. Use --reset to wipe first."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="DELETE all schools first")

    def handle(self, *args, **options):
        if options["reset"]:
            deleted, _ = School.objects.all().delete()
            self.stdout.write(f"Deleted {deleted} rows")
        path = Path(__file__).resolve().parents[2] / "fixtures" / "sample_schools.json"
        added = 0
        for row in json.loads(path.read_text(encoding="utf-8")):
            exists = School.objects.filter(name__iexact=row["name"], area__iexact=row["area"], city__iexact=row["city"]).exists()
            if exists:
                continue
            School.objects.create(
                name=row["name"], area=row["area"], city=row["city"], state=row.get("state", ""),
                board=row["board"], grades=row["grades"], type=row["type"], gender=row["gender"],
                rating=row.get("rating", 0), reviews=row.get("reviews", 0), fee=row["fee"],
                facilities=row.get("facilities", []), photos=row.get("photos", 0),
                top_rated=row.get("topRated", False), phone=row.get("phone", ""), image=row.get("image", ""),
            )
            added += 1
        self.stdout.write(self.style.SUCCESS(f"Seed done: {added} added"))
