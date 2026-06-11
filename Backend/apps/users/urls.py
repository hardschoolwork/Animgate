from django.contrib.auth.views import LogoutView
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.users.views import RegisterView, profile_view, ProfileView, AdminUserListView, AdminUserUpdateView, \
    AdminUserDeleteView, ChangePasswordView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', profile_view, name='profile'),
    path('updateProfile/', ProfileView.as_view(), name='update_profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users-list'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('admin/users/<int:pk>/update/', AdminUserUpdateView.as_view(), name='admin-users-toggle'),
]