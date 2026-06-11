from django.db.models import Case, When, IntegerField
from rest_framework import status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.interactions.models import Notification
from apps.suggestions.models import suggestion
from apps.suggestions.models.suggestion import Suggestion
from apps.suggestions.serializers.suggestion_serializer import SuggestionUserSerializer, SuggestionAdminSerializer


class SuggestionGlobalView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        suggestions = Suggestion.objects.filter(user=request.user)
        serializer = SuggestionUserSerializer(suggestions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SuggestionUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SuggestionAdminViewset(viewsets.ModelViewSet):

    permission_classes = [IsAdminUser]

    queryset = Suggestion.objects.annotate(
        state_order = Case(
            When(state="pending", then=0),
            When(state="accepted", then=1),
            When(state="rejected", then=2),

            output_field=IntegerField(),
        )
    ).order_by("state_order")

    serializer_class = SuggestionAdminSerializer

    def perform_update(self, serializer):
        old_state = self.get_object().state
        suggestion = serializer.save()
        new_state = suggestion.state
        if old_state != new_state:
            if new_state == "accepted":
                message = (f"Cher "
                           f"{suggestion.user.username} "
                           f" votre recommandation de {suggestion.suggested_anim}, "
                           f" a été acceptée. "
                           f" merci!"

                )
            else:
                message = (f"Cher "
                           f"{suggestion.user.username}, "
                           f" votre recommandation de {suggestion.suggested_anim} "
                           f" a été refusé. "
                           f"Merci! "
                )
            Notification.objects.create(
                title="Reponse de recommandation",
                recipient=suggestion.user,
                message=message,
            )



