from rest_framework.authtoken import serializers
from ..models.watchHistory import WatchHistory
from ...catalog.serializers import EpisodeListSerializer


class WatchHistorySerializer(serializers.ModelSerializer):
    """
    User — read their own watch history (Library > Recent).

    GET  /api/watch-history/          → list last watched episodes
    POST /api/watch-history/          → create entry when user starts an episode
    PATCH /api/watch-history/{id}/    → update progress every ~10 seconds

    The `episode_detail` nested object gives the frontend everything it needs
    to render a "Continue Watching" card: thumbnail, title, season/episode number.
    `anim_*` fields let the frontend navigate back to the anime page.
    """
    episode_detail = EpisodeListSerializer(source='episode', read_only=True)
    anim_title = serializers.CharField(source='episode.anim.title', read_only=True)
    anim_slug = serializers.CharField(source='episode.anim.slug', read_only=True)
    anim_cover = serializers.ImageField(source='episode.anim.cover_image', read_only=True)
    progress_percent = serializers.ReadOnlyField()

    class Meta:
        model = WatchHistory
        fields = [
            'id',
            'episode',  # write-only (send episode id to create/update)
            'episode_detail',  # read-only  (nested episode data for the card)
            'anim_title',
            'anim_slug',
            'anim_cover',
            'progress',
            'progress_percent',
            'completed',
            'watched_at',
        ]
        read_only_fields = ['id', 'watched_at', 'progress_percent']
        extra_kwargs = {
            'episode': {'write_only': True},
        }