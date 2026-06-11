from django.db import models
from django.conf import settings
from ...catalog.models import Anim
from ...users.models import User


class Favorite(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    anim = models.ForeignKey(
        Anim,
        on_delete=models.CASCADE,
        related_name='favorite'
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'anim')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user} ♥ {self.anim}"