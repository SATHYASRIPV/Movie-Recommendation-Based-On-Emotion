from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, Emotion, Recommendation, User
from .serializers import UserSerializer, MovieSerializer, EmotionSerializer, RecommendationSerializer, EmotionPreferenceSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movie.objects.filter(user=user)

class EmotionView(generics.GenericAPIView):
    queryset = Emotion.objects.all()
    serializer_class = EmotionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movie.objects.filter(user=user)

class RecommendationView(generics.GenericAPIView):
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Recommendation.objects.filter(user=user)
    
class SavePreferencesView(APIView):

    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user = request.user
        preferences = request.data.get('preferences', [])
        errors = []

        for pref in preferences:
            for genre in pref.get('genres', []):
                data = {'emotion': pref['emotion'], 'genre': genre, 'user': user.id}
                serializer = EmotionPreferenceSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    errors.append(serializer.errors)

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Preferences saved successfully"}, status=status.HTTP_201_CREATED)