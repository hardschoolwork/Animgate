from django.urls import path
from apps.suggestions.views import suggestion_view
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('suggestions', suggestion_view.SuggestionAdminViewset, basename='suggestionAdmin')
urlpatterns = router.urls