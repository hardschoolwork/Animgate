from django.urls import path
from rest_framework.routers import DefaultRouter

from .views.watchHistory_view import WatchHistoryView, WatchlistView, WatchlistDestroyView
from .views import notification_view, favorite_view

router = DefaultRouter()
# router.register('notifications', notification_view.NotificationViewset, basename='notificationsUser')
urlpatterns = [
    path('notification/<int:id>', notification_view.NotificationView.as_view(), name='notificationDetail'),
    path('notifications/', notification_view.get_all_notifications, name='notificationsList'),
    path('favorites/', favorite_view.FavoriteView.as_view(), name='favoritesList'),
    path('favorite/<int:id>', favorite_view.FavoriteDeleteView.as_view(), name='favoriteDetail'),
    path('watch-history/', WatchHistoryView.as_view(), name='watch-history'),
    path('watchlist/', WatchlistView.as_view(), name='watchlist'),
    path('watchlist/<int:pk>/', WatchlistDestroyView.as_view(), name='watchlist-destroy'),
]