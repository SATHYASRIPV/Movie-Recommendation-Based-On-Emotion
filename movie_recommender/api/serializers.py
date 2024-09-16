from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie,Emotion,Recommendation,EmotionPreference

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password','email']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['title','rating','genre','director','year']


class EmotionSerializer(serializers.Serializer):
    class Meta:
        model = Emotion
        fields = '__all__'

class RecommendationSerializer(serializers.Serializer):
    class Meta:
        model = Recommendation
        fields = '__all__'

class EmotionPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionPreference
        fields = ['emotion', 'genre']

    