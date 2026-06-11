from rest_framework import viewsets, permissions

from apps.catalog.models import Category
from apps.catalog.serializers import CategoryListSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategoryListSerializer