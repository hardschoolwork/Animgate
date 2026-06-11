from django.db import models
from django.utils.text import slugify


class Genre(models.Model):
    """
    Narrative genre of an anime (Action, Romance, Isekai, Shonen...).

    Genre vs Category:
      Genre    = what kind of story  -> Action, Sci-Fi, Romance
      Category = editorial grouping  -> Trending, New Releases, Top 10
    """
    name        = models.CharField(max_length=100, unique=True)
    slug        = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    # Boxicon class used by frontend filter chips, e.g. "bx-run"
    icon        = models.CharField(max_length=60, blank=True)

    class Meta:
        # Default ordering so API lists genres alphabetically without extra work
        ordering = ['name']

    def save(self, *args, **kwargs):
        # Auto-generate slug from name so we never have to set it manually
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name