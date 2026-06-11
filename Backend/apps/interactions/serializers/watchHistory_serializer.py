from rest_framework import serializers
from ..models.watchHistory import WatchHistory, Watchlist
from ...catalog.serializers.episode_serializer import EpisodeDetailSerializer
from ...catalog.serializers.anime_serializer import AnimCardSerializer

class WatchHistorySerializer(serializers.ModelSerializer):
    episode_detail = EpisodeDetailSerializer(source='episode', read_only=True)
    anime_title = serializers.CharField(source='episode.anim.title', read_only=True)
    anime_slug = serializers.CharField(source='episode.anim.slug', read_only=True)
    anime_cover = serializers.CharField(source='episode.anim.cover_image', read_only=True, allow_null=True)

    class Meta:
        model = WatchHistory
        fields = ['id', 'episode', 'episode_detail', 'anime_title', 'anime_slug', 'anime_cover', 'progress_percentage', 'last_watched', 'is_completed']
        read_only_fields = ['user']


class WatchlistSerializer(serializers.ModelSerializer):
    anime_detail = AnimCardSerializer(source='anime', read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'anime', 'anime_detail', 'added_at']
        read_only_fields = ['user']