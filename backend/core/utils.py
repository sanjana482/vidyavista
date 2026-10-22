import re


def slugify(value: str) -> str:
    value = str(value or "").lower().replace("&", "and")
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-")


def id_from_param(param: str):
    """'maplewood-academy-whitefield-bengaluru-1' or '1' -> 1"""
    m = re.search(r"(\d+)$", str(param or ""))
    return int(m.group(1)) if m else None


# Hero labels / old URLs / CSV spellings -> the 3 stored school types
_TYPE_ALIASES = {
    "day": "Day",
    "day school": "Day",
    "day schools": "Day",
    "day boarding": "Day Boarding",
    "day-boarding": "Day Boarding",
    "day - boarding": "Day Boarding",
    "day + boarding": "Day Boarding",
    "day + boarding schools": "Day Boarding",
    "full boarding": "Full Boarding",
    "full-boarding": "Full Boarding",
    "boarding": "Full Boarding",
    "boarding school": "Full Boarding",
    "boarding schools": "Full Boarding",
}


def normalize_type(value: str):
    return _TYPE_ALIASES.get(str(value or "").strip().lower())


def csv_safe(value):
    """CSV-injection guard: a cell starting with = + - @ would run as a formula in Excel."""
    s = "" if value is None else str(value)
    return "'" + s if s[:1] in ("=", "+", "-", "@", "\t", "\r") else s
