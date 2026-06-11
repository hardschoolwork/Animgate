from django.contrib import admin

from apps.interactions.models import Notification, Favorite

# Register your models here.
admin.site.register(Notification)
admin.site.register(Favorite)
