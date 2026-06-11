from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models.watchHistory import WatchHistory, Watchlist
from ..serializers.watchHistory_serializer import WatchHistorySerializer, WatchlistSerializer


class WatchHistoryView(generics.ListCreateAPIView):
    serializer_class = WatchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # On exclut les épisodes 100% terminés pour la section "Continuer à regarder"
        return WatchHistory.objects.filter(user=self.request.user, is_completed=False).select_related(
            'episode__anim').order_by('-last_watched')

    def perform_create(self, serializer):
        # update_or_create permet de mettre à jour la progression si l'épisode existe déjà
        episode_id = self.request.data.get('episode')
        progress = self.request.data.get('progress_percentage', 0)
        is_completed = self.request.data.get('is_completed', False)

        WatchHistory.objects.update_or_create(
            user=self.request.user,
            episode_id=episode_id,
            defaults={'progress_percentage': progress, 'is_completed': is_completed}
        )


class WatchlistView(generics.ListCreateAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user).select_related('anime')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WatchlistDestroyView(generics.DestroyAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)