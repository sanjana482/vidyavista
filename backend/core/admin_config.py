from django.contrib.admin.apps import AdminConfig


class VVAdminConfig(AdminConfig):
    """Makes `admin.site` our branded site (logo, colours, dashboard) instead of the stock one."""

    default_site = "core.admin_site.VidyaVistaAdminSite"
