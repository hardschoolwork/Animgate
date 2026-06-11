from django.db import models
from django.conf import settings
# Assure-toi d'importer tes modèles Anime et Episode (ajuste le nom de l'app si besoin)
from ...catalog.models.anim import Anim
from ...catalog.models.episode import  Episode

class WatchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE)
    progress_percentage = models.FloatField(default=0.0)
    last_watched = models.DateTimeField(auto_now=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'episode')
        ordering = ['-last_watched']

    def __str__(self):
        return f"{self.user.username} - {self.episode.title} ({self.progress_percentage}%)"


class Watchlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime = models.ForeignKey(Anim, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'anime')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username} - {self.anime.title}"