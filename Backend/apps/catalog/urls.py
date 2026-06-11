from django.urls import path

from .views.anime_view import AnimViewSet, HomeFeedView
from .views.category_view import CategoryViewSet
from .views.episode_view import *
from rest_framework import routers, views
from rest_framework.routers import DefaultRouter

from .views.genre_view import GenreViewSet

router = DefaultRouter()
router.register(r'anims',  AnimViewSet,  basename='anim')
router.register(r'genres', GenreViewSet, basename='genre')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = router.urls

urlpatterns += [
    path('home/feed/', HomeFeedView.as_view(), name='home'),
    # ceci c'est pour le home page
    path('anim/episode/<int:episode_id>/', EpisodeDetailView.as_view(), name='episode'),
    # ceci c'est pour la page detail d'un episode. ainsi on peut voir notre episode sans probleme
]

