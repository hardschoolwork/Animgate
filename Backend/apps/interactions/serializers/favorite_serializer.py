from rest_framework import serializers

from ...catalog.serializers.anime_serializer import AnimCardSerializer
from ..models.favorite import Favorite


class FavoriteSerializer(serializers.ModelSerializer):

    anim_detail = AnimCardSerializer(source='anim', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'anim', 'anim_detail', 'added_at']
        read_only_fields = ['id', 'added_at']
        extra_kwargs = {
            'anim': {'write_only': True},
        }

    def validate(self, attrs):
        user = self.context['request'].user
        if Favorite.objects.filter(user=user, anim=attrs['anim']).exists():
            raise serializers.ValidationError("This anime is already in your favorites.")
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)