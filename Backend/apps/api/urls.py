from django.urls import path, include

urlpatterns = [
    path('',include('apps.catalog.urls')),
    path('', include('apps.suggestions.urls')),
    path('',include('apps.interactions.urls')),
    path('',include('apps.users.urls')),
    path('admin/', include('apps.catalog.admin_urls')),
    path('admin/', include('apps.suggestions.admin_urls')),




]