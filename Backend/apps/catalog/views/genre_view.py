from rest_framework import viewsets

from apps.catalog.models import Genre
from apps.catalog.serializers.genre_serializer import GenreListSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all().order_by('name')
    serializer_class = GenreListSerializer