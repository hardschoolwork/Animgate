from django.urls import path
from .views.anime_view import AnimViewSet, HomeFeedView, AdminAnimeViewSet, AdminStat
from rest_framework.routers import DefaultRouter
from .views.category_view import CategoryViewSet
from .views.episode_view import EpisodeAdminViewSet
from .views.genre_view import GenreViewSet

router = DefaultRouter()

router.register(r'anims',  AdminAnimeViewSet,  basename='animAdmin')
router.register(r'episode', EpisodeAdminViewSet, basename='episodeAdmin')
router.register(r'genres', GenreViewSet, basename='genreAdmin')
router.register(r'categories', CategoryViewSet, basename='categoryAdmin')
urlpatterns = router.urls

urlpatterns += [
    path('stats', AdminStat.as_view(), name='AdminStat'),
]
