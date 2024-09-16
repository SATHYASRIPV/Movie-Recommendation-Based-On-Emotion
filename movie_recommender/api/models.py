from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Movie(models.Model):
    title = models.CharField(max_length=100,unique=True,null=False)
    genre = models.CharField(max_length=50,null=False)
    rating = models.IntegerField(validators=[
        MaxValueValidator(1),
        MinValueValidator(10)
    ])  
    director = models.CharField(max_length=50)
    year = models.PositiveIntegerField(validators=[MinValueValidator(1888)])
    tmdb_id = models.IntegerField(unique=True)
    def __str__(self):
        return self.title

class Emotion(models.Model):
    EMOTION_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('surprised', 'Surprised'),
        ('neutral', 'Neutral'),
        ('fearful', 'Fearful'),
        ('disgusted', 'Disgusted')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emotion = models.CharField(max_length=10, choices=EMOTION_CHOICES)
    detected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username +"-"+ self.emotion
    
class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emotion = models.ForeignKey(Emotion, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    recommended_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.movie.title}'
    
class EmotionPreference(models.Model):
    emotion = models.CharField(max_length=20)
    genre = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.emotion}: {self.genre}"