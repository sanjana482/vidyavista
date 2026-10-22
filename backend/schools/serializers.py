from rest_framework import serializers

from .models import School


class SchoolSerializer(serializers.ModelSerializer):
    """Same JSON shape the Next.js site already uses (camelCase, `schoolId`)."""

    schoolId = serializers.IntegerField(source="pk", read_only=True)
    slug = serializers.CharField(read_only=True)
    topRated = serializers.BooleanField(source="top_rated", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = (
            "schoolId", "slug", "name", "area", "city", "state", "board", "grades", "type", "gender",
            "rating", "reviews", "fee", "facilities", "photos", "topRated", "phone", "image",
            "about", "established", "students", "student_teacher_ratio", "campus", "address", "email", "website", "is_verified",
        )
        read_only_fields = fields

    def get_image(self, obj):
        return obj.cover_url(self.context.get("request"))
