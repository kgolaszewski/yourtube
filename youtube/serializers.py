from rest_framework import serializers

from .models import CustomUser, Youtuber, Video, Tag

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username')

class YoutuberSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Youtuber 
        fields = ('username', 'name', 'channel')

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'video_id', 'date', 'youtuber')
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('category', 'youtuber')

class FeedSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        latest = instance.videos.first()
        return {
            'name': instance.name,
            'channel': instance.channel,
            'title': latest.title,
            'url': f"https://youtube.com/watch?v={latest.video_id}",
        }