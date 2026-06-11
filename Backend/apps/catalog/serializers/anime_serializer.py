from rest_framework import serializers
from ..models.anim     import Anim
from ..models.genre    import Genre
from ..models.category import Category
from .genre_serializer       import GenreListSerializer
from .category_serializer    import CategoryListSerializer

class AnimCardSerializer(serializers.ModelSerializer):

    episodes_count = serializers.SerializerMethodField()

    class Meta:
        model  = Anim
        fields = [
            'id',
            'title',
            'slug',
            'cover_image',
            'status',
            'release_year',
            'episodes_count',
            'rating',
        ]
    def get_episodes_count(self, obj):
        return obj.episodes.count()

class AnimSliderSerializer(serializers.ModelSerializer):

    genres = serializers.StringRelatedField(many=True)

    banner_image = serializers.SerializerMethodField()

    class Meta:
        model = Anim
        fields = [
            'id',
            'title',
            'slug',
            'banner_image',
            'synopsis',
            'genres',
            'age_rating'
        ]

    def get_banner_image(self, obj):
        request = self.context.get('request')
        if obj.banner_image and request:
            return request.build_absolute_uri(obj.banner_image.url)
        return None

class AnimDetailSerializer(serializers.ModelSerializer):

    genres         = serializers.StringRelatedField(many=True)
    categories     = serializers.StringRelatedField(many=True)

    episodes_count  = serializers.SerializerMethodField()

    class Meta:
        model  = Anim
        fields = [
            'id',
            'title',
            'title_japanese',
            'slug',
            'synopsis',
            'cover_image',
            'banner_image',
            'trailer_url',
            'type',
            'status',
            'age_rating',
            'genres',
            'categories',
            'studio',
            'release_year',
            'episodes_count',
            'rating',
        ]

    def get_episodes_count(self,obj):
        return obj.episodes.count()





# ─────────────────────────────────────────────────────────────────────────────
# ADMIN SERIALIZERS
# ─────────────────────────────────────────────────────────────────────────────

class AnimAdminListSerializer(serializers.ModelSerializer):

    genres     = GenreListSerializer(many=True, read_only=True)
    categories = CategoryListSerializer(many=True, read_only=True)
    is_new_release = serializers.SerializerMethodField()

    class Meta:
        model  = Anim
        fields = [
            'id',
            'title',
            'slug',
            'cover_image',
            'type',
            'status',
            'genres',
            'categories',
            'release_year',
            'rating',
            'is_featured',
            'is_trending',
            'is_new_release',
        ]

    def get_is_new_release(self, obj):
        return obj.is_new_release



# serializers.py

class AnimAdminWriteSerializer(serializers.ModelSerializer):

    genre_ids    = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, source='genres', queryset=Genre.objects.all(), required=False
    )
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, source='categories', queryset=Category.objects.all(), required=False
    )

    class Meta:
        model = Anim
        fields = [
            'id',
            'title',
            'title_japanese',
            'studio',
            'type',
            'status',
            'age_rating',
            'episode_duration',
            'release_year',
            'synopsis',
            'genre_ids',
            'category_ids',
            'cover_image',
            'banner_image',
            'trailer_url',
            'is_featured',
            'is_trending',
        ]
        read_only_fields = ['id', 'is_trending', 'episode_duration']

    def create(self, validated_data):
        genres = validated_data.pop('genres', [])
        categories = validated_data.pop('categories', [])
        anim = Anim.objects.create(**validated_data)
        anim.genres.set(genres)
        anim.categories.set(categories)
        return anim

    def update(self, instance, validated_data):
        genres = validated_data.pop('genres', None)
        categories = validated_data.pop('categories', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if genres is not None: instance.genres.set(genres)
        if categories is not None: instance.categories.set(categories)
        return instance