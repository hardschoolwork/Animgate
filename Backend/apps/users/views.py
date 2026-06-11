from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView

from apps.users.models import User
from apps.users.serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'date_joined': user.date_joined,
        })

    def patch(self, request, format=None):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Retourne les infos de l'utilisateur connecté via POST /api/profile"""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'date_joined': user.date_joined,
    })



class AdminUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'is_staff', 'is_active']
        read_only_fields = ['id', 'date_joined', 'username', 'email']


class AdminUserListView(generics.ListAPIView):

    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # On affiche tous les utilisateurs, triés par date d'inscription
        return User.objects.all().order_by('-date_joined')


class AdminUserUpdateView(generics.UpdateAPIView):
    """Permet de modifier is_staff (admin) et is_active (désactivation)"""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'

    def get_queryset(self):
        return User.objects.all()

    def patch(self, request, *args, **kwargs):
        user = self.get_object()

        # Sécurité : Empêcher un admin de se désactiver ou de se retirer les droits lui-même
        if user == request.user:
            return Response(
                {"error": "Vous ne pouvez pas modifier vos propres droits ou statut."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Mise à jour sécurisée des champs
        if 'is_staff' in request.data:
            user.is_staff = bool(request.data['is_staff'])
        if 'is_active' in request.data:
            user.is_active = bool(request.data['is_active'])

        user.save()
        return Response(AdminUserSerializer(user).data, status=status.HTTP_200_OK)

class AdminUserDeleteView(generics.DestroyAPIView):


    permission_classes = [IsAdminUser]
    lookup_field = 'pk'

    def get_queryset(self):
        return User.objects.all()

    def delete(self, request, *args, **kwargs):
        user = self.get_object()

        if user == request.user:
            return Response({"error": "Vous ne pouvez pas vous supprimer vous-même"}, status=status.HTTP_403_FORBIDDEN)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # On met à jour le mot de passe de l'utilisateur connecté
        user = self.request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response(
            {"detail": "Mot de passe modifié avec succès."},
            status=status.HTTP_200_OK
        )