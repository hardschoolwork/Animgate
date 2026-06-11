from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import notification
from ..models.notification import Notification
from ..serializers.notification_serializer import NotificationSerializer

@api_view(['GET'])
def get_all_notifications(request):
    permission_classes = [IsAuthenticated]
    notifications = Notification.objects.filter(recipient=request.user)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

class NotificationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request, id):
        notification = get_object_or_404(Notification,id=id)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

    def patch(self,request, id):

        notification = get_object_or_404(Notification,id=id)

            # On la marque comme lue
        notification.is_read = True
        notification.save()

        return Response(
            {"message": "Notification marquée comme lue", "id": notification.id},
            status=status.HTTP_200_OK
        )


# a supprimer
class NotificationViewset(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user,
        )
    serializer_class = NotificationSerializer
