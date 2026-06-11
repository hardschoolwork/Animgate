from datetime import timedelta

from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

from .genre    import Genre
from .category import Category


class AnimType(models.TextChoices):
    SERIES  = 'series',  'Series'
    MOVIE   = 'movie',   'Movie'
    OVA     = 'ova',     'OVA'
    ONA     = 'ona',     'ONA'
    SPECIAL = 'special', 'Special'


class AnimStatus(models.TextChoices):
    ONGOING   = 'ongoing',   'Ongoing'
    COMPLETED = 'completed', 'Completed'
    UPCOMING  = 'upcoming',  'Upcoming'
    HIATUS    = 'hiatus',    'On Hiatus'


class AgeRating(models.TextChoices):
    ALL    = 'all',  'All Ages'
    PG13   = 'pg13', '13+'
    PG16   = 'pg16', '16+'
    MATURE = 'r18',  '18+'


class AnimQuerySet(models.QuerySet):
    def new_releases(self, days=30):
        threshold = timezone.now() - timedelta(days=days)
        return self.filter(created_at__gte=threshold)



class Anim(models.Model):

    objects = AnimQuerySet.as_manager()

    # ── Identity ──────────────────────────────────────────────
    title          = models.CharField(max_length=255)
    title_japanese = models.CharField(max_length=255, blank=True)
    slug           = models.SlugField(max_length=300, unique=True, blank=True)
    synopsis       = models.TextField(blank=True)

    # ── Media ────────────────────────────────────────────────
    cover_image    = models.ImageField(upload_to='anims/covers/',  blank=True, null=True)
    banner_image   = models.ImageField(upload_to='anims/banners/', blank=True, null=True)
    trailer_url    = models.URLField(blank=True)

    # ── Classification ───────────────────────────────────────
    type       = models.CharField(max_length=20, choices=AnimType.choices,  default=AnimType.SERIES)
    status     = models.CharField(max_length=20, choices=AnimStatus.choices, default=AnimStatus.ONGOING)
    age_rating = models.CharField(max_length=10, choices=AgeRating.choices,  default=AgeRating.ALL)

    genres     = models.ManyToManyField(Genre,    related_name='anims_by_genre',    blank=True)
    categories = models.ManyToManyField(Category, related_name='anims_by_category', blank=True)

    # ── Production info ──────────────────────────────────────
    studio           = models.CharField(max_length=150, blank=True)
    release_year = models.PositiveIntegerField(
        verbose_name="Année de sortie",
        blank=True,
        null=True,
        help_text="Ex: 2024"
    )
    end_date         = models.DateField(blank=True, null=True)
    total_episodes   = models.PositiveIntegerField(default=0)

    # average episode length in minutes, shown in hero slider meta
    episode_duration = models.PositiveIntegerField(default=24)

    # ── Homepage visibility flags ────────────────────────────
    # is_featured   -> appears in the hero slider
    # is_trending   -> appears in the Trending section
    # is_new_release -> appears in the New Releases section
    is_featured    = models.BooleanField(default=False)
    is_trending    = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # ── Metrics ──────────────────────────────────────────────
    rating      = models.DecimalField(
        max_digits=3, decimal_places=1, default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-id']

    @property
    def is_new_release(self):
        return timezone.now() - self.created_at < timedelta(days=30)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
