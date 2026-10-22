from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.functions import Lower
from django.utils.html import format_html

from core.utils import slugify


class School(models.Model):
    class Board(models.TextChoices):
        CBSE = "CBSE", "CBSE"
        ICSE = "ICSE", "ICSE"
        IB = "IB", "IB"
        CAMBRIDGE = "Cambridge", "Cambridge"
        STATE = "State Board", "State Board"

    class SchoolType(models.TextChoices):
        DAY = "Day", "Day"
        DAY_BOARDING = "Day Boarding", "Day Boarding"
        FULL_BOARDING = "Full Boarding", "Full Boarding"

    class Gender(models.TextChoices):
        COED = "Co-ed", "Co-ed"
        GIRLS = "Girls", "Girls"
        BOYS = "Boys", "Boys"

    name = models.CharField(max_length=150)
    area = models.CharField("Area / locality", max_length=100)
    city = models.CharField(max_length=80, db_index=True)
    state = models.CharField(max_length=80, db_index=True)

    board = models.CharField(max_length=20, choices=Board.choices, default=Board.CBSE)
    grades = models.CharField(max_length=40, default="Nursery – XII", help_text="e.g. Nursery – XII, V – XII")
    type = models.CharField("School type", max_length=20, choices=SchoolType.choices, default=SchoolType.DAY)
    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.COED)

    fee = models.PositiveIntegerField("Annual tuition fee (₹)", validators=[MinValueValidator(0)])
    rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)], help_text="0 to 5")
    reviews = models.PositiveIntegerField("Number of reviews", default=0)
    photos = models.PositiveSmallIntegerField("Photos in gallery", default=0)
    facilities = ArrayField(
        models.CharField(max_length=60), blank=True, default=list, size=20,
        help_text="Comma separated, e.g. Transport, Sports, Library",
    )

    phone = models.CharField(max_length=20, blank=True)
    image = models.URLField("Cover image link", max_length=500, blank=True, help_text="Paste a link OR upload a file below")
    image_file = models.ImageField("Cover image upload", upload_to="schools/", blank=True, null=True)

    top_rated = models.BooleanField("Top rated", default=False, help_text="Shows the ★ badge and ranks higher in 'Recommended'")
    is_active = models.BooleanField("Live on website", default=True, help_text="Untick to hide the school without deleting it")
        
    is_verified = models.BooleanField(default=False)
    about = models.TextField(blank=True, help_text="Paragraphs ke beech ek khali line chhodo")
    established = models.PositiveSmallIntegerField(null=True, blank=True)
    students = models.PositiveIntegerField(null=True, blank=True)
    student_teacher_ratio = models.PositiveSmallIntegerField(null=True, blank=True)
    campus = models.CharField(max_length=40, blank=True, help_text="e.g. 1.91 acres")
    address = models.CharField(max_length=250, blank=True)
    email = models.EmailField(blank=True)
    website = models.CharField(max_length=150, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_active", "-top_rated", "-rating"], name="school_listing_idx"),
            models.Index(fields=["board"], name="school_board_idx"),
            models.Index(fields=["type"], name="school_type_idx"),
        ]
        constraints = [
            models.UniqueConstraint(Lower("name"), Lower("area"), Lower("city"), name="uniq_school_name_area_city"),
        ]

    def __str__(self):
        return f"{self.name}, {self.area}, {self.city}"

    @property
    def slug(self):
        return f"{slugify(f'{self.name} {self.area} {self.city}')}-{self.pk}"

    def cover_url(self, request=None):
        if self.image_file:
            url = self.image_file.url
            return request.build_absolute_uri(url) if request else url
        return self.image

    def thumb_html(self):
        url = self.cover_url()
        if url:
            return format_html('<img src="{}" alt="" style="height:40px;width:56px;object-fit:cover;border-radius:8px">', url)
        return "🏫"
class FeeComponent(models.Model):
    """Master list: Tuition, Admission, Annual charges, Lab fee... Naya component yahan add hoga."""
    class Freq(models.TextChoices):
        ONE_TIME = "One-time", "One-time"
        MONTHLY = "Monthly", "Monthly"
        ANNUALLY = "Annually", "Annually"

    name = models.CharField(max_length=80, unique=True)
    frequency = models.CharField(max_length=10, choices=Freq.choices, default=Freq.ANNUALLY)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return f"{self.name} ({self.frequency})"


CLASS_CHOICES = [(c, c) for c in ["Nursery", "KG"] + [f"Class {i}" for i in range(1, 13)]]
SESSION_CHOICES = [("2026-27", "2026-27"), ("2027-28", "2027-28")]


class ClassFee(models.Model):
    """Ek row = ek school + ek session + ek class + ek component ki amount."""
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="fee_items")
    session = models.CharField(max_length=7, choices=SESSION_CHOICES, default="2027-28")
    class_name = models.CharField(max_length=10, choices=CLASS_CHOICES)
    component = models.ForeignKey(FeeComponent, on_delete=models.PROTECT)
    amount = models.PositiveIntegerField("Amount (₹)")

    class Meta:
        constraints = [models.UniqueConstraint(fields=["school", "session", "class_name", "component"], name="uniq_class_fee")]
        indexes = [models.Index(fields=["school", "session"])]

    def __str__(self):
        return f"{self.school_id} {self.session} {self.class_name} {self.component.name}"