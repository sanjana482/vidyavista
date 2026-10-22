import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Creates the first admin from DJANGO_SUPERUSER_USERNAME / _EMAIL / _PASSWORD if no superuser exists yet."

    def handle(self, *args, **options):
        User = get_user_model()
        if User.objects.filter(is_superuser=True).exists():
            return
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
        if not username or not password:
            self.stdout.write(self.style.WARNING("No admin yet. Set DJANGO_SUPERUSER_USERNAME + DJANGO_SUPERUSER_PASSWORD, or run: python manage.py createsuperuser"))
            return
        User.objects.create_superuser(username=username, email=os.environ.get("DJANGO_SUPERUSER_EMAIL", ""), password=password)
        self.stdout.write(self.style.SUCCESS(f"Admin created: {username}  (change the password in the admin: top-right 'Change password')"))
