"""
Import schools from a CSV file into the current Django project's School model.

Expected CSV columns are shown in vidyavista_schools_sample.csv.
- facilities: separate values with | (example: Library|Sports|Transport)
- image_file: leave blank unless you intentionally handle file uploads separately
- Existing rows with the same name + city are skipped (no duplicates).
Run this from the backend folder with the project's virtual environment active:
    python import_schools_csv.py vidyavista_schools_sample.csv
"""
import csv
import sys
import django
from pathlib import Path

# This script should be run from the backend folder.
sys.path.insert(0, str(Path(__file__).resolve().parent))
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from schools.models import School

def as_bool(value):
    return str(value).strip().lower() in {"1", "true", "yes", "y"}

def main():
    if len(sys.argv) < 2:
        print("Usage: python import_schools_csv.py <csv-file>")
        raise SystemExit(1)

    csv_path = Path(sys.argv[1]).resolve()
    if not csv_path.is_file():
        print(f"CSV file not found: {csv_path}")
        raise SystemExit(1)

    created_count = 0
    skipped_count = 0

    with csv_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        required = {
            "name", "area", "city", "state", "board", "grades", "type",
            "gender", "fee", "rating", "reviews", "photos", "facilities",
            "phone", "image", "top_rated", "is_active"
        }
        missing = required - set(reader.fieldnames or [])
        if missing:
            print("Missing CSV columns:", ", ".join(sorted(missing)))
            raise SystemExit(1)

        for line_number, row in enumerate(reader, start=2):
            try:
                name = row["name"].strip()
                city = row["city"].strip()
                if not name or not city:
                    raise ValueError("name and city are required")

                defaults = {
                    "area": row["area"].strip(),
                    "state": row["state"].strip(),
                    "board": row["board"].strip(),
                    "grades": row["grades"].strip(),
                    "type": row["type"].strip(),
                    "gender": row["gender"].strip(),
                    "fee": int(row["fee"]),
                    "rating": float(row["rating"]),
                    "reviews": int(row["reviews"]),
                    "photos": int(row["photos"]),
                    "facilities": [x.strip() for x in row["facilities"].split("|") if x.strip()],
                    "phone": row["phone"].strip(),
                    "image": row["image"].strip(),
                    "top_rated": as_bool(row["top_rated"]),
                    "is_active": as_bool(row["is_active"]),
                }

                _, created = School.objects.get_or_create(
                    name=name,
                    city=city,
                    defaults=defaults,
                )
                if created:
                    created_count += 1
                else:
                    skipped_count += 1
            except Exception as exc:
                print(f"Row {line_number} failed: {exc}")

    print(f"Import complete. Added: {created_count}; skipped existing: {skipped_count}")
    print(f"Total schools in database: {School.objects.count()}")

if __name__ == "__main__":
    main()
