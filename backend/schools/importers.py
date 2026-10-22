"""Bulk import of schools from a CSV file (used by the 'Import CSV' button in the admin)."""
import csv
import io
import re

from django.core.exceptions import ValidationError
from django.db import transaction

from core.utils import normalize_type

from .models import School

COLUMNS = ["name", "area", "city", "state", "board", "grades", "type", "gender", "fee", "rating", "reviews", "photos", "phone", "image", "facilities", "top_rated", "is_active"]
REQUIRED = ["name", "area", "city", "state", "board", "grades", "type", "fee"]
ALIASES = {
    "school name": "name", "school": "name", "locality": "area", "area / locality": "area", "town": "city",
    "school type": "type", "annual fee": "fee", "annual fees": "fee", "fees": "fee", "fee (inr)": "fee",
    "mobile": "phone", "phone number": "phone", "photo": "image", "image url": "image", "facility": "facilities",
    "top rated": "top_rated", "live": "is_active", "active": "is_active", "classes": "grades",
}
SAMPLE_ROW = ["Maplewood Academy", "Whitefield", "Bengaluru", "Karnataka", "CBSE", "Nursery – XII", "Day", "Co-ed", "145000", "4.5", "120", "8", "+919800000001", "https://example.com/photo.jpg", "Transport|Sports|Library", "yes", "yes"]
MAX_ROWS = 500


def field_for(header: str):
    n = re.sub(r"[\s_-]+", " ", header.strip().lower())
    compact = n.replace(" ", "")
    for c in COLUMNS:
        if c.replace("_", "") == compact:
            return c
    return ALIASES.get(n)


def _choice(value, choices, label):
    for c in choices:
        if c.lower() == str(value).strip().lower():
            return c
    raise ValidationError(f"{label} must be one of: {', '.join(choices)}")


def _bool(value, default):
    v = str(value).strip().lower()
    if v == "":
        return default
    return v in ("1", "true", "yes", "y")


def _number(value, label, cast=int):
    try:
        return cast(float(re.sub(r"[,₹\s]", "", str(value)) or 0))
    except ValueError:
        raise ValidationError(f"{label} must be a number")


def build_school(d: dict) -> School:
    ctype = normalize_type(d.get("type", ""))
    if not ctype:
        raise ValidationError(f"type must be one of: {', '.join(School.SchoolType.values)}")
    return School(
        name=d.get("name", "").strip(),
        area=d.get("area", "").strip(),
        city=d.get("city", "").strip(),
        state=d.get("state", "").strip(),
        board=_choice(d.get("board", ""), School.Board.values, "board"),
        grades=d.get("grades", "").strip() or "Nursery – XII",
        type=ctype,
        gender=_choice(d.get("gender") or "Co-ed", School.Gender.values, "gender"),
        fee=_number(d.get("fee", ""), "fee"),
        rating=_number(d.get("rating", ""), "rating", float),
        reviews=_number(d.get("reviews", ""), "reviews"),
        photos=_number(d.get("photos", ""), "photos"),
        phone=d.get("phone", "").strip(),
        image=d.get("image", "").strip(),
        facilities=[x.strip() for x in re.split(r"[|;,]", d.get("facilities", "")) if x.strip()][:20],
        top_rated=_bool(d.get("top_rated", ""), False),
        is_active=_bool(d.get("is_active", ""), True),
    )


def import_schools_csv(uploaded) -> dict:
    result = {"created": 0, "skipped": [], "errors": [], "ignored": []}
    text = uploaded.read().decode("utf-8-sig", errors="replace")
    rows = list(csv.reader(io.StringIO(text)))
    if len(rows) < 2:
        result["errors"].append((1, "The file needs a header row and at least one school"))
        return result

    header = rows[0]
    fields = [field_for(h) for h in header]
    result["ignored"] = [h for h, f in zip(header, fields) if not f and h.strip()]
    missing = [c for c in REQUIRED if c not in fields]
    if missing:
        result["errors"].append((1, f"Missing column(s): {', '.join(missing)}"))
        return result
    if len(rows) - 1 > MAX_ROWS:
        result["errors"].append((1, f"Import {MAX_ROWS} rows at a time (file has {len(rows) - 1})"))
        return result

    for line, cells in enumerate(rows[1:], start=2):
        if not any(c.strip() for c in cells):
            continue
        data = {f: cells[i].strip() for i, f in enumerate(fields) if f and i < len(cells)}
        try:
            school = build_school(data)
            if School.objects.filter(name__iexact=school.name, area__iexact=school.area, city__iexact=school.city).exists():
                result["skipped"].append((line, f"{school.name} ({school.area}, {school.city}) already exists"))
                continue
            school.full_clean()
            with transaction.atomic():
                school.save()
            result["created"] += 1
        except ValidationError as exc:
            result["errors"].append((line, "; ".join(exc.messages)))
    return result
