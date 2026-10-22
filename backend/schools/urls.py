from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r"^schools/?$", views.SchoolListView.as_view()),
    re_path(r"^schools/meta/?$", views.SchoolMetaView.as_view()),
    re_path(r"^schools/sitemap/?$", views.SchoolSitemapView.as_view()),
    re_path(r"^schools/(?P<id_or_slug>[^/]+)/?$", views.SchoolDetailView.as_view()),
]
