from rest_framework.authtoken import serializers

from ..models.animeRecommendation import AnimeRecommendation


class AnimeRecommendationSerializer(serializers.ModelSerializer):
    """
    User — submit a recommendation via the modal button.

    POST /api/recommendations/   → { "title": "FMA Brotherhood", "note": "..." }

    The view will automatically:
      1. Set user = request.user
      2. Create a Notification for every admin user
    """

    class Meta:
        model = AnimeRecommendation
        fields = ['id', 'title', 'note', 'status', 'admin_reply', 'created_at']
        # Users cannot set status or admin_reply — those come from the admin
        read_only_fields = ['id', 'status', 'admin_reply', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AnimeRecommendationAdminSerializer(serializers.ModelSerializer):
    """
    Admin — review pending recommendations and reply.

    PATCH /api/admin/recommendations/{id}/  → { "status": "accepted", "admin_reply": "..." }

    The view will automatically create a Notification for the user
    after the admin replies (handled in the service layer).
    """
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AnimeRecommendation
        fields = [
            'id', 'username', 'title', 'note',
            'status', 'admin_reply', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'username', 'title', 'note', 'created_at']