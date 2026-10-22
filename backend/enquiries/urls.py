from django.urls import re_path

from .views import EnquiryCreateView

urlpatterns = [re_path(r"^enquiries/?$", EnquiryCreateView.as_view())]
