from django.conf import settings
from django.db import models

from ...catalog.models import Anim
from .animeRecommendation import AnimeRecommendation
from ...users.models import User


class Notification(models.Model):

    title = models.CharField(max_length=255)
    message = models.TextField()
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"→ {self.recipient.username} | {self.title}"