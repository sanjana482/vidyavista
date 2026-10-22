import csv

from django import forms
from django.conf import settings
from django.contrib import admin, messages
from django.core.cache import cache
from django.core.exceptions import PermissionDenied
from django.db.models import Count, F, Q
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.urls import path
from django.utils.html import format_html

from core.utils import csv_safe

from .importers import COLUMNS, SAMPLE_ROW, import_schools_csv
from .models import ClassFee, FeeComponent, School
from .signals import CACHE_KEYS, _safe_delay


class DataQualityFilter(admin.SimpleListFilter):
    title = "data quality"
    parameter_name = "quality"

    def lookups(self, request, model_admin):
        return [("noimage", "Missing photo"), ("nophone", "Missing phone number"), ("noreviews", "No reviews yet")]

    def queryset(self, request, queryset):
        v = self.value()
        if v == "noimage":
            return queryset.filter(image="").filter(Q(image_file="") | Q(image_file__isnull=True))
        if v == "nophone":
            return queryset.filter(phone="")
        if v == "noreviews":
            return queryset.filter(reviews=0)
        return queryset


class CsvImportForm(forms.Form):
    file = forms.FileField(label="CSV file", help_text="Up to 500 schools. Save from Excel / Google Sheets as CSV (UTF-8).")


@admin.register(FeeComponent)
class FeeComponentAdmin(admin.ModelAdmin):
    list_display = ("name", "frequency", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")


class ClassFeeInline(admin.TabularInline):
    model = ClassFee
    extra = 0


@admin.register(ClassFee)
class ClassFeeAdmin(admin.ModelAdmin):
    list_display = ("school", "session", "class_name", "component", "amount")
    list_editable = ("amount",)
    list_filter = ("session", "class_name", "component")
    search_fields = ("school__name", "school__city")
    list_per_page = 50
    actions = ["raise_10"]

    @admin.action(description="Amount +10%")
    def raise_10(self, request, qs):
        qs.update(amount=F("amount") * 11 / 10)


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ("thumb", "name", "place", "board", "type", "fee_display", "rating_display", "enquiry_count", "top_rated", "is_active")
    list_display_links = ("thumb", "name")
    list_editable = ("top_rated", "is_active")  # quick toggles right from the list
    list_filter = ("is_active", "top_rated", "board", "type", "gender", "state", "city", DataQualityFilter)
    search_fields = ("name", "area", "city", "state", "phone")
    list_per_page = 25
    save_on_top = True
    change_list_template = "admin/schools/school/change_list.html"
    readonly_fields = ("image_preview", "public_link", "created_at", "updated_at")
    actions = ["make_live", "hide", "mark_top", "unmark_top", "export_csv"]
    inlines = [ClassFeeInline]
    fieldsets = (
        ("Basic details", {"fields": ("name", ("area", "city"), ("state", "grades"))}),
        ("Classification", {"fields": (("board", "type", "gender"),)}),
        ("Fees, rating & contact", {"fields": (("fee", "phone"), ("rating", "reviews", "photos"))}),
        ("Cover image", {"fields": ("image", "image_file", "image_preview")}),
        ("Facilities", {"fields": ("facilities",)}),
        ("Visibility", {"fields": (("is_active", "top_rated"),)}),
        ("About & profile", {"fields": ("is_verified", "about", ("established", "students", "student_teacher_ratio"), "campus", "address", ("email", "website"))}),
        ("Info", {"classes": ("collapse",), "fields": ("public_link", "created_at", "updated_at")}),
    )

    # ---- columns ----
    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_enq=Count("enquiries"))

    @admin.display(description="")
    def thumb(self, obj):
        return obj.thumb_html()

    @admin.display(description="Location", ordering="city")
    def place(self, obj):
        return f"{obj.area}, {obj.city}"

    @admin.display(description="Fee / year", ordering="fee")
    def fee_display(self, obj):
        return f"₹{obj.fee:,}"

    @admin.display(description="Rating", ordering="rating")
    def rating_display(self, obj):
        return f"{obj.rating:.1f} ★ ({obj.reviews})" if obj.reviews else "-"

    @admin.display(description="Enquiries", ordering="_enq")
    def enquiry_count(self, obj):
        return obj._enq

    @admin.display(description="Preview")
    def image_preview(self, obj):
        url = obj.cover_url() if obj and obj.pk else ""
        return format_html('<img src="{}" alt="" style="max-height:160px;border-radius:12px">', url) if url else "No image yet"

    @admin.display(description="Public page")
    def public_link(self, obj):
        if not obj or not obj.pk:
            return "-"
        url = f"{settings.FRONTEND_URL}/schools/{obj.slug}"
        return format_html('<a href="{}" target="_blank" rel="noopener">{} ↗</a>', url, url)

    # ---- bulk actions (queryset.update() skips signals, so we refresh search + cache ourselves) ----
    def _after_bulk(self, queryset_pks):
        from .tasks import index_school

        cache.delete_many(CACHE_KEYS)
        for pk in queryset_pks:
            _safe_delay(index_school, pk)

    def _update(self, request, queryset, label, **values):
        pks = list(queryset.values_list("pk", flat=True))
        n = School.objects.filter(pk__in=pks).update(**values)
        self._after_bulk(pks)
        self.message_user(request, f"{n} school(s) {label}.", messages.SUCCESS)

    @admin.action(description="✅ Make live on website")
    def make_live(self, request, queryset):
        self._update(request, queryset, "made live", is_active=True)

    @admin.action(description="🙈 Hide from website")
    def hide(self, request, queryset):
        self._update(request, queryset, "hidden", is_active=False)

    @admin.action(description="★ Mark as top rated")
    def mark_top(self, request, queryset):
        self._update(request, queryset, "marked top rated", top_rated=True)

    @admin.action(description="Remove top rated badge")
    def unmark_top(self, request, queryset):
        self._update(request, queryset, "unmarked", top_rated=False)

    @admin.action(description="⬇ Export selected to CSV")
    def export_csv(self, request, queryset):
        resp = HttpResponse(content_type="text/csv; charset=utf-8")
        resp["Content-Disposition"] = 'attachment; filename="schools.csv"'
        resp.write("\ufeff")
        w = csv.writer(resp)
        w.writerow(COLUMNS)
        for s in queryset:
            w.writerow([csv_safe(v) for v in (
                s.name, s.area, s.city, s.state, s.board, s.grades, s.type, s.gender, s.fee, s.rating, s.reviews,
                s.photos, s.phone, s.cover_url(request), "|".join(s.facilities or []), "yes" if s.top_rated else "no", "yes" if s.is_active else "no",
            )])
        return resp

    # ---- CSV import ----
    def get_urls(self):
        return [
            path("import-csv/", self.admin_site.admin_view(self.import_view), name="schools_school_import_csv"),
            path("import-template/", self.admin_site.admin_view(self.template_view), name="schools_school_import_template"),
        ] + super().get_urls()

    def template_view(self, request):
        resp = HttpResponse(content_type="text/csv; charset=utf-8")
        resp["Content-Disposition"] = 'attachment; filename="vidyavista-schools-template.csv"'
        resp.write("\ufeff")
        w = csv.writer(resp)
        w.writerow(COLUMNS)
        w.writerow(SAMPLE_ROW)
        return resp

    def import_view(self, request):
        if not self.has_add_permission(request):
            raise PermissionDenied
        form = CsvImportForm(request.POST or None, request.FILES or None)
        result = None
        if request.method == "POST" and form.is_valid():
            result = import_schools_csv(form.cleaned_data["file"])
            if result["created"]:
                self.message_user(request, f"{result['created']} school(s) imported.", messages.SUCCESS)
        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "title": "Import schools from CSV",
            "form": form,
            "result": result,
            "types": School.SchoolType.values,
            "boards": School.Board.values,
            "genders": School.Gender.values,
        }
        return TemplateResponse(request, "admin/schools/school/import_csv.html", context)