from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    pass
    # add additional fields in here

    def __str__(self):
        return self.username

class Youtuber(models.Model):
    username   = models.CharField(max_length=128, primary_key=True)
    name       = models.CharField(max_length=128)
    channel    = models.CharField(max_length=128)

    def __str__(self):
        return self.name

class Video(models.Model):
    video_id = models.CharField(max_length=128, primary_key=True)
    title    = models.CharField(max_length=128)
    date     = models.DateField()
    youtuber = models.ForeignKey(Youtuber, on_delete=models.CASCADE, related_name="videos")

class Tag(models.Model):
    category = models.CharField(max_length=128)
    youtuber = models.ForeignKey(Youtuber, on_delete=models.CASCADE, related_name="tags")