from rest_framework import serializers

from ..models.suggestion import Suggestion


class SuggestionUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = ("id","suggested_anim","message","state")

        read_only_fields = ("state",)

class SuggestionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = ("id","suggested_anim","message","state")
        read_only_fields = ("id","suggested_anim","message")