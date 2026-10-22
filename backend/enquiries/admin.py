import csv

from django.contrib import admin, messages
from django.http import HttpResponse
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html

from core.utils import csv_safe

from .models import Enquiry

STATUS_COLORS = {
    "new": ("#FDE8EF", "#C8104F"),
    "contacted": ("#E1F1FA", "#0A5C91"),
    "converted": ("#E3F6EC", "#047857"),
    "closed": ("#EEF1F5", "#5C6A7B"),
}


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("received", "parent", "contact", "school_link", "child", "status_badge")
    list_display_links = ("received", "parent")
    list_filter = ("status", ("created_at", admin.DateFieldListFilter), "city")
    search_fields = ("parent_name", "mobile", "school_name", "child_name", "city", "email")
    date_hierarchy = "created_at"
    list_per_page = 30
    save_on_top = True
    list_select_related = ("school",)
    readonly_fields = ("contact_buttons", "source", "preference_type", "preference_location", "ip", "created_at", "updated_at")
    actions = ["mark_new", "mark_contacted", "mark_converted", "mark_closed", "export_csv"]
    fieldsets = (
        ("Status & follow-up", {"fields": ("status", "admin_note", "contact_buttons")}),
        ("Parent", {"fields": (("parent_name", "relation"), ("mobile", "email"), "city", "note")}),
        ("Admission request", {"fields": ("school", "school_name", ("child_name", "class_name", "session"))}),
        ("Where it came from", {"classes": ("collapse",), "fields": ("source", "preference_type", "preference_location", "ip", "created_at", "updated_at")}),
    )
    autocomplete_fields = ()
    raw_id_fields = ("school",)

    @admin.display(description="Received", ordering="created_at")
    def received(self, obj):
        return timezone.localtime(obj.created_at).strftime("%d %b %Y, %I:%M %p")

    @admin.display(description="Parent", ordering="parent_name")
    def parent(self, obj):
        return format_html("<b>{}</b><br><small>{}</small>", obj.parent_name, obj.relation or "")

    @admin.display(description="Contact")
    def contact(self, obj):
        return format_html(
            '<a href="tel:+91{0}" class="vv-chip">📞 {0}</a> <a href="https://wa.me/91{0}" target="_blank" rel="noopener" class="vv-chip">💬</a>',
            obj.mobile,
        )

    @admin.display(description="Contact buttons")
    def contact_buttons(self, obj):
        if not obj or not obj.mobile:
            return "-"
        return self.contact(obj)

    @admin.display(description="School", ordering="school_name")
    def school_link(self, obj):
        if obj.school_id:
            return format_html('<a href="{}">{}</a>', reverse("admin:schools_school_change", args=[obj.school_id]), obj.school_name)
        return obj.school_name

    @admin.display(description="Child")
    def child(self, obj):
        return f"{obj.child_name} · Class {obj.class_name}" if obj.child_name and obj.class_name else (obj.child_name or "-")

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        bg, fg = STATUS_COLORS.get(obj.status, STATUS_COLORS["closed"])
        return format_html('<span style="background:{};color:{};padding:3px 11px;border-radius:999px;font-weight:700;font-size:12px">{}</span>', bg, fg, obj.get_status_display())

    def _set(self, request, queryset, status):
        n = queryset.update(status=status)
        self.message_user(request, f"{n} enquiry(ies) marked as {status}.", messages.SUCCESS)

    @admin.action(description="Mark as New")
    def mark_new(self, request, queryset):
        self._set(request, queryset, Enquiry.Status.NEW)

    @admin.action(description="📞 Mark as Contacted")
    def mark_contacted(self, request, queryset):
        self._set(request, queryset, Enquiry.Status.CONTACTED)

    @admin.action(description="🎯 Mark as Converted")
    def mark_converted(self, request, queryset):
        self._set(request, queryset, Enquiry.Status.CONVERTED)

    @admin.action(description="Mark as Closed")
    def mark_closed(self, request, queryset):
        self._set(request, queryset, Enquiry.Status.CLOSED)

    @admin.action(description="⬇ Export selected to CSV")
    def export_csv(self, request, queryset):
        resp = HttpResponse(content_type="text/csv; charset=utf-8")
        resp["Content-Disposition"] = f'attachment; filename="enquiries-{timezone.localdate()}.csv"'
        resp.write("\ufeff")
        w = csv.writer(resp)
        w.writerow(["Date (IST)", "Status", "Parent", "Relation", "Mobile", "Email", "City", "Child", "Class", "Session",
                    "School", "Parent note", "Admin note", "Source page", "Searched type", "Searched location"])
        for e in queryset:
            w.writerow([csv_safe(v) for v in (
                timezone.localtime(e.created_at).strftime("%Y-%m-%d %H:%M"), e.status, e.parent_name, e.relation, e.mobile, e.email,
                e.city, e.child_name, e.class_name, e.session, e.school_name, e.note, e.admin_note, e.source,
                e.preference_type, e.preference_location,
            )])
        return resp
