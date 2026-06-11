from django.db import models
from django.conf import settings
from ...catalog.models import Anim, Episode


# ── Watch History ─────────────────────────────────────────────────────────────
class WatchHistory(models.Model):
    """
    Tracks how far a user has watched an episode.

    This serves two purposes:
      1. "Library > Recent" section: list the last episodes the user watched
         ordered by `watched_at` descending.
      2. Resume playback: the player reads `progress` (seconds) on load
         and seeks to that position.

    The frontend player sends a PATCH every ~10 seconds with the current
    playback position. When the user finishes an episode, `completed` is
    set to True.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='watch_history'
    )
    episode = models.ForeignKey(
        Episode,
        on_delete=models.CASCADE,
        related_name='watch_histories'
    )
    # seconds watched — updated by the player in real time
    progress = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)
    # auto_now=True: updated every time the player sends a PATCH
    watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        # One row per (user, episode) pair — no duplicates
        unique_together = ('user', 'episode')
        ordering = ['-watched_at']

    def __str__(self):
        return f"{self.user} → {self.episode} ({self.progress}s)"

    @property
    def progress_percent(self):
        """Returns 0-100. Used by the frontend to render a progress bar."""
        d = self.episode.duration
        return round((self.progress / d) * 100) if d else 0