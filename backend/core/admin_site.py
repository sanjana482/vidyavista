from datetime import timedelta

from django.contrib.admin import AdminSite
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.utils import timezone

BRAND = {"new": "#EC0E58", "contacted": "#0795DC", "converted": "#059669", "closed": "#8896A6"}


def _bars(rows, key):
    top = max([r["n"] for r in rows] + [1])
    return [{"label": r[key] or "Unknown", "n": r["n"], "pct": max(4, round(r["n"] / top * 100))} for r in rows]


def dashboard_context():
    """Everything the dashboard on the admin home page shows. Imported lazily (models need loaded apps)."""
    from enquiries.models import Enquiry
    from schools.models import School

    now = timezone.now()
    today = timezone.localtime(now).replace(hour=0, minute=0, second=0, microsecond=0)

    s = School.objects.aggregate(
        total=Count("id"),
        active=Count("id", filter=Q(is_active=True)),
        top=Count("id", filter=Q(top_rated=True)),
        no_image=Count("id", filter=Q(image="") & (Q(image_file="") | Q(image_file__isnull=True))),
        no_phone=Count("id", filter=Q(phone="")),
        no_reviews=Count("id", filter=Q(reviews=0)),
    )

    status = dict(Enquiry.objects.values_list("status").annotate(n=Count("id")))
    e_total = sum(status.values())
    last7 = Enquiry.objects.filter(created_at__gte=now - timedelta(days=7)).count()
    prev7 = Enquiry.objects.filter(created_at__gte=now - timedelta(days=14), created_at__lt=now - timedelta(days=7)).count()
    delta = round((last7 - prev7) / prev7 * 100) if prev7 else (100 if last7 else 0)

    # 14-day trend
    since = today - timedelta(days=13)
    per_day = {
        r["d"]: r["n"]
        for r in Enquiry.objects.filter(created_at__gte=since).annotate(d=TruncDate("created_at")).values("d").annotate(n=Count("id"))
    }
    days = [today.date() - timedelta(days=13 - i) for i in range(14)]
    peak = max([per_day.get(d, 0) for d in days] + [1])
    daily = [
        {"label": d.strftime("%d %b"), "n": per_day.get(d, 0), "pct": max(3, round(per_day.get(d, 0) / peak * 100)) if per_day.get(d, 0) else 2, "today": d == today.date()}
        for d in days
    ]

    # pipeline donut (pure CSS conic-gradient)
    stops, acc = [], 0.0
    for key in ("new", "contacted", "converted", "closed"):
        part = (status.get(key, 0) / e_total * 100) if e_total else 0
        if part:
            stops.append(f"{BRAND[key]} {acc:.2f}% {acc + part:.2f}%")
            acc += part
    donut = f"conic-gradient({', '.join(stops)})" if stops else "conic-gradient(#EEF2F6 0 100%)"

    attention = [
        {"n": s["no_image"], "text": "schools have no photo", "url": "?quality=noimage"},
        {"n": s["no_phone"], "text": "schools have no phone number", "url": "?quality=nophone"},
        {"n": s["no_reviews"], "text": "schools have no reviews yet", "url": "?quality=noreviews"},
        {"n": s["total"] - s["active"], "text": "schools are hidden from the website", "url": "?is_active__exact=0"},
    ]

    return {
        "vv": {
            "schools": s,
            "hidden": s["total"] - s["active"],
            "enq_total": e_total,
            "enq_today": Enquiry.objects.filter(created_at__gte=today).count(),
            "enq_new": status.get("new", 0),
            "enq_contacted": status.get("contacted", 0),
            "enq_converted": status.get("converted", 0),
            "enq_closed": status.get("closed", 0),
            "last7": last7,
            "delta": delta,
            "delta_abs": abs(delta),
            "conversion": round(status.get("converted", 0) / e_total * 100, 1) if e_total else 0,
            "daily": daily,
            "donut": donut,
            "top_schools": _bars(list(Enquiry.objects.values("school_name").annotate(n=Count("id")).order_by("-n")[:5]), "school_name"),
            "by_city": _bars(list(School.objects.values("city").annotate(n=Count("id")).order_by("-n")[:6]), "city"),
            "by_board": _bars(list(School.objects.values("board").annotate(n=Count("id")).order_by("-n")), "board"),
            "by_type": _bars(list(School.objects.values("type").annotate(n=Count("id")).order_by("-n")), "type"),
            "attention": [a for a in attention if a["n"] > 0],
            "recent": list(Enquiry.objects.order_by("-created_at")[:6]),
        }
    }


class VidyaVistaAdminSite(AdminSite):
    site_header = "VidyaVista"
    site_title = "VidyaVista Admin"
    index_title = "Dashboard"

    def index(self, request, extra_context=None):
        ctx = dashboard_context()
        ctx.update(extra_context or {})
        return super().index(request, ctx)
