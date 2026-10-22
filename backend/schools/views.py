from django.core.cache import cache
from django.db.models import Case, IntegerField, Q, When
from rest_framework.response import Response
from rest_framework.views import APIView

from core.utils import id_from_param, normalize_type

from . import search
from .models import School
from .serializers import SchoolSerializer

SORTS = {
    "recommended": ["-top_rated", "-rating", "-reviews", "pk"],
    "rating": ["-rating", "-reviews", "pk"],
    "fee-low": ["fee", "pk"],
    "fee-high": ["-fee", "pk"],
}


def csv(value):
    return [x.strip() for x in (value or "").split(",") if x.strip()]


def to_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


class SchoolListView(APIView):
    """
    GET /api/schools
      ?q=powai &type=Day,Full Boarding &city=Mumbai,Pune &state=Maharashtra &board=CBSE &gender=Girls
      &minFee=0 &maxFee=200000 &sort=recommended|rating|fee-low|fee-high &page=1 &limit=10
    Multiple values are comma separated.  Response: {"data": [...], "meta": {total, page, limit, pages}}
    """

    def get(self, request):
        p = request.query_params
        qs = School.objects.filter(is_active=True)

        ranked_ids = None
        q = (p.get("q") or "").strip()
        if q:
            ranked_ids = search.search_ids(q, limit=200)  # Meilisearch (typo tolerant); None -> use the database
            if ranked_ids is None:
                qs = qs.filter(Q(name__icontains=q) | Q(area__icontains=q) | Q(city__icontains=q) | Q(board__icontains=q))
            else:
                qs = qs.filter(pk__in=ranked_ids)

        types = [t for t in (normalize_type(x) for x in csv(p.get("type"))) if t]
        if types:
            qs = qs.filter(type__in=types)
        if csv(p.get("city")):
            qs = qs.filter(city__in=csv(p.get("city")))
        if csv(p.get("state")):
            qs = qs.filter(state__in=csv(p.get("state")))
        boards = [b for b in csv(p.get("board")) if b in School.Board.values]
        if boards:
            qs = qs.filter(board__in=boards)
        genders = [g for g in csv(p.get("gender")) if g in School.Gender.values]
        if genders:
            qs = qs.filter(gender__in=genders)
        if p.get("minFee"):
            qs = qs.filter(fee__gte=to_int(p.get("minFee")))
        if p.get("maxFee"):
            qs = qs.filter(fee__lte=to_int(p.get("maxFee"), 10**9))

        sort = p.get("sort")
        if ranked_ids and not sort:  # text search without an explicit sort -> best match first
            rank = Case(*[When(pk=pk, then=i) for i, pk in enumerate(ranked_ids)], output_field=IntegerField())
            qs = qs.annotate(_rank=rank).order_by("_rank")
        else:
            qs = qs.order_by(*SORTS.get(sort, SORTS["recommended"]))

        page = max(1, to_int(p.get("page"), 1))
        limit = min(50, max(1, to_int(p.get("limit"), 10)))
        total = qs.count()
        rows = qs[(page - 1) * limit : page * limit]
        data = SchoolSerializer(rows, many=True, context={"request": request}).data
        return Response({"data": data, "meta": {"total": total, "page": page, "limit": limit, "pages": max(1, -(-total // limit))}})


class SchoolMetaView(APIView):
    """GET /api/schools/meta -> values for filter dropdowns."""

    def get(self, request):
        data = cache.get("schools:meta")
        if data is None:
            active = School.objects.filter(is_active=True)
            data = {
                "cities": sorted(active.values_list("city", flat=True).distinct()),
                "states": sorted(active.values_list("state", flat=True).distinct()),
                "boards": School.Board.values,
                "types": School.SchoolType.values,
                "genders": School.Gender.values,
            }
            cache.set("schools:meta", data, 300)
        return Response(data)


class SchoolSitemapView(APIView):
    """GET /api/schools/sitemap -> lightweight list for sitemap.xml."""

    def get(self, request):
        data = cache.get("schools:sitemap")
        if data is None:
            rows = School.objects.filter(is_active=True).only("id", "name", "area", "city", "updated_at")
            data = [{"slug": s.slug, "updatedAt": s.updated_at.isoformat()} for s in rows]
            cache.set("schools:sitemap", data, 300)
        return Response({"data": data})


class SchoolDetailView(APIView):
    """GET /api/schools/<id or slug>  ("9" or "vspk-international-school-sector-13-rohini-delhi-9")"""

    def get(self, request, id_or_slug):
        pk = id_from_param(id_or_slug)
        school = School.objects.filter(pk=pk, is_active=True).first() if pk else None
        if not school:
            return Response({"message": "School not found"}, status=404)
        return Response({"data": SchoolSerializer(school, context={"request": request}).data})
