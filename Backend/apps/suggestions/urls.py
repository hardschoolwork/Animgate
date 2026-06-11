from django.urls import path

from .views import suggestion_view

urlpatterns = [
    path('suggestions/', suggestion_view.SuggestionGlobalView.as_view()),
]