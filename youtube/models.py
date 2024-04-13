from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    pass
    # add additional fields in here

    def __str__(self):
        return self.username

class Youtuber(models.Model):
    username     = models.CharField(max_length=128, primary_key=True)
    display_name = models.CharField(max_length=128)
    channel      = models.CharField(max_length=128)
    last_upload  = models.CharField(max_length=128, null=True)

    subscribers  = models.ManyToManyField(CustomUser, related_name='subscriptions', related_query_name='subscription')

    def __str__(self):
        return self.display_name

class Video(models.Model):
    video_id = models.CharField(max_length=128, primary_key=True)
    title    = models.CharField(max_length=128)
    date     = models.DateField()
    youtuber = models.ForeignKey(Youtuber, on_delete=models.CASCADE, related_name="videos")
    length   = models.DurationField(null=True)

    class Meta:
        ordering = ['-date', 'title']

    def __str__(self):
        return f"{self.title} (@{self.youtuber})"
    
class Category(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="categories")
    tag  = models.CharField(max_length=128)

    class Meta:
        unique_together = [["user", "tag"]]

    def __str__(self):
        return f"{self.tag} (u/{self.user})"

class Tag(models.Model):
    youtuber = models.ForeignKey(Youtuber, on_delete=models.CASCADE, related_name="tags")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="tags")

    class Meta:
        unique_together = [["youtuber", "category"]]

    def __str__(self):
        return f"@{self.youtuber} ({self.category})"
