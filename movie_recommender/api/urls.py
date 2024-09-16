from django.urls import path,include
from . import views


urlpatterns = [
    path("movies/",views.MovieListView.as_view()),
    path('emotion-preferences/', views.SavePreferencesView.as_view(), name='emotion_preferences'),
]
