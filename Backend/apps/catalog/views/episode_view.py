from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from ..models.episode import Episode
from ..serializers.episode_serializer import *
from ..models.anim import  Anim
from rest_framework import serializers, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view


class EpisodeDetailView(APIView):

    def get(self, request, episode_id):

        episode = get_object_or_404(Episode,id=episode_id)
        serializers = EpisodeDetailSerializer(episode, context={'request': request})
        return Response(serializers.data, status=status.HTTP_200_OK)

class EpisodeAdminViewSet(viewsets.ModelViewSet):

    queryset = Episode.objects.all().order_by('id')

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return EpisodeDetailSerializer
        return EpisodeAdminSerializer
