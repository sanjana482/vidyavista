from django.db import models

from schools.models import School


class Enquiry(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        CONVERTED = "converted", "Converted"
        CLOSED = "closed", "Closed"

    school = models.ForeignKey(School, null=True, blank=True, on_delete=models.SET_NULL, related_name="enquiries")
    school_name = models.CharField(max_length=150)
    child_name = models.CharField(max_length=80, blank=True)
    class_name = models.CharField("Class", max_length=30, blank=True)
    session = models.CharField(max_length=20, blank=True)

    parent_name = models.CharField(max_length=80)
    relation = models.CharField(max_length=30, blank=True)
    mobile = models.CharField(max_length=10)
    email = models.EmailField(blank=True)
    city = models.CharField(max_length=60, blank=True)
    note = models.TextField("Parent's message", max_length=500, blank=True)

    source = models.CharField("Submitted from page", max_length=200, blank=True)
    preference_type = models.CharField("Searched type", max_length=40, blank=True)
    preference_location = models.CharField("Searched location", max_length=60, blank=True)

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.NEW, db_index=True)
    admin_note = models.TextField("Internal note", max_length=1000, blank=True, help_text="Never shown to the parent")
    ip = models.GenericIPAddressField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"
        indexes = [models.Index(fields=["status", "-created_at"], name="enq_status_created_idx")]

    def __str__(self):
        return f"{self.parent_name} → {self.school_name}"
