from datetime import timedelta

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import api_view, action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Episode, AnimType
from ..serializers.episode_serializer import EpisodeListSerializer
from ..serializers.anime_serializer import *
from ..services.anime_service import *
from ...users.models import User


class HomeFeedView(APIView):

    permission_classes = [IsAuthenticated]
    def get(self, request):

        base_qs = Anim.objects.filter(is_active=True).select_related().prefetch_related('genres')

        hero_qs = base_qs.filter(is_featured=True).order_by('?')[:5]
        hero_card = base_qs.order_by('?')[:10]

        movies_qs = base_qs.filter(type=AnimType.MOVIE).order_by('-release_year')[:5]
        movies_card = base_qs.filter(type=AnimType.MOVIE).order_by('?')[:10]

        new_qs = base_qs.new_releases(days=30).order_by('-created_at')[:5]
        new_card = base_qs.new_releases(days=30).order_by('-created_at')[:10]

        return Response({
            "hero": {
                "slides": AnimSliderSerializer(hero_qs, many=True, context={"request": request}).data,
                "cards": AnimCardSerializer(hero_card, many=True, context={"request": request}).data
            },
            "movies": {
                "slides": AnimSliderSerializer(movies_qs, many=True, context={"request": request}).data,
                "cards": AnimCardSerializer(movies_card, many=True, context={"request": request}).data
            },
            "new_releases": {
                "slides": AnimSliderSerializer(new_qs, many=True, context={"request": request}).data,
                "cards": AnimCardSerializer(new_card, many=True, context={"request": request}).data
            }
        })


class AnimViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    pagination_class = AnimePagination

    # On garde tes backends de filtre
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # ✅ AJOUT : 'release_year' pour permettre le filtre par année natif
    filterset_fields = ['type', 'status', 'is_trending', 'age_rating', 'release_year']

    # ✅ AJOUT : 'studio__name' si 'studio' est une ForeignKey (sinon garde juste 'studio')
    search_fields = ['title', 'title_japanese', 'synopsis', 'studio__name']

    # ✅ AJOUT : 'title' pour permettre le tri alphabétique
    ordering_fields = ['release_year', 'rating', 'title']
    ordering = ['-release_year']

    def get_queryset(self):

        queryset = Anim.objects.filter(is_active=True).prefetch_related('genres', 'categories')

        genres_param = self.request.query_params.get('genres', None)
        if genres_param:
            genre_ids = [int(g) for g in genres_param.split(',') if g.isdigit()]
            if genre_ids:
                queryset = queryset.filter(genres__id__in=genre_ids).distinct()


        categories_param = self.request.query_params.get('categories', None)
        if categories_param:
            category_ids = [int(c) for c in categories_param.split(',') if c.isdigit()]
            if category_ids:
                queryset = queryset.filter(categories__id__in=category_ids).distinct()

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AnimDetailSerializer
        return AnimCardSerializer

    @action(detail=True, url_path='episodes', methods=['get'])
    def episodes(self, request, slug=None):
        anim = self.get_object()
        episodes = anim.episodes.all().order_by('episode_number')
        return Response(EpisodeListSerializer(episodes, many=True).data)


class AdminAnimeViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAdminUser]
    lookup_field = 'slug'
    queryset = Anim.objects.all().order_by('-id')

    def get_serializer_class(self):
        if self.action == 'list':
            return AnimAdminListSerializer
        return AnimAdminWriteSerializer

    @action(detail=True, url_path='episodes', methods=['get'])
    def episodes(self, request, slug=None):
        anim = self.get_object()
        episodes = anim.episodes.all().order_by('episode_number')
        return Response(EpisodeListSerializer(episodes, many=True).data)

class AdminStat(APIView):

    permission_classes = [IsAdminUser]
    def get(self, request, format=None):
        number_of_users = User.objects.count()
        number_of_anims=Anim.objects.count()
        number_of_episodes = Episode.objects.count()
        return Response({
            'number_of_users': number_of_users,
            'number_of_anims': number_of_anims,
            'number_of_episodes': number_of_episodes,
        })