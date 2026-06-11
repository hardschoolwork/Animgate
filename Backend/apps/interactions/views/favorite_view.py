from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.interactions.models import Favorite
from apps.interactions.serializers.favorite_serializer import FavoriteSerializer


class FavoriteView(APIView):

    def get(self, request):
        favorites = Favorite.objects.filter(user_id=request.user.id)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FavoriteSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavoriteDeleteView(APIView):

    def get(self, request, id):
        favorite = get_object_or_404(Favorite, id=id)
        serializer = FavoriteSerializer(favorite)
        return Response(serializer.data)

    def delete(self, request, id):
        favorite = Favorite.objects.get(id=id)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)