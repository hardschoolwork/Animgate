from django.db import models
from .anim import Anim

def upload_episode_video(instance, filename):

    anime_name = instance.anim.slug
    extension = filename.split('.')[-1]

    new_filename = f"episode_{instance.episode_number}.{extension}"
    return f"episodes/{anime_name}/{new_filename}"

class Episode(models.Model):

    anim           = models.ForeignKey(Anim, on_delete=models.CASCADE, related_name='episodes')

    episode_number = models.PositiveIntegerField()

    title          = models.CharField(max_length=255, blank=True)
    description    = models.TextField(blank=True)
    thumbnail      = models.ImageField(upload_to='episodes/thumbnails/', blank=True, null=True) #miniature

    video_url      = models.URLField(blank=True)
    episode_video  = models.FileField(upload_to=upload_episode_video, blank=True, null=True)
    duration       = models.PositiveIntegerField(default=0)

    release_date   = models.DateField(blank=True, null=True)
    is_filler      = models.BooleanField(default=False)
    views_count    = models.PositiveIntegerField(default=0)

    class Meta:
        # Prevent duplicate S01E01 for the same anime
        unique_together = ('anim', 'episode_number')
        ordering = ['episode_number']

    def save(self, *args, **kwargs):
        if self.is_filler and "Filler" not in self.title:
            self.title = "Filler " + self.title

        super().save(*args, **kwargs)

    def __str__(self):
        label = f" – {self.title}" if self.title else ""
        return f"{self.anim.title} E{self.episode_number:02d}{label}"



    @property
    def duration_minutes(self):
        return round(self.duration / 60) if self.duration else 0