from rest_framework import serializers
from ..models.episode import Episode


class EpisodeListSerializer(serializers.ModelSerializer):

    duration_minutes = serializers.ReadOnlyField()

    class Meta:
        model  = Episode
        fields = [
            'id',
            'episode_number',
            'title',
            'thumbnail',
            'duration_minutes',
            'release_date',
            'is_filler',
        ]


class EpisodeDetailSerializer(serializers.ModelSerializer):

    duration_minutes = serializers.ReadOnlyField()
    anim_title       = serializers.CharField(source='anim.title', read_only=True)
    anim_slug        = serializers.CharField(source='anim.slug',  read_only=True)
    anim_cover       = serializers.ImageField(source='anim.cover_image', read_only=True)


    class Meta:
        model  = Episode
        fields = [
            'id',
            'anim_title',
            'anim_slug',
            'anim_cover',
            'episode_number',
            'title',
            'description',
            'thumbnail',
            'episode_video',
            'duration_minutes',
            'release_date',
        ]


class EpisodeAdminSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Episode
        fields = [
            'id',
            'anim',
            'episode_number',
            'title',
            'description',
            'thumbnail',
            'video_url',
            'episode_video',
            'release_date',
            'is_filler',
        ]