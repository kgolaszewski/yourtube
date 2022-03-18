from rest_framework import serializers

from .models import CustomUser, Youtuber, Video, Tag

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username')

class YoutuberSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Youtuber 
        fields = ('username', 'name', 'channel', 'last_upload')

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'video_id', 'length', 'date', 'youtuber')
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('category', 'youtuber')

class FeedSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        return {
            'name': instance.youtuber.name,
            'imagename': instance.youtuber.username,
            'channel': instance.youtuber.channel,
            'title': instance.title,
            'url': f"https://youtube.com/watch?v={instance.video_id}",
            'id': instance.video_id,
            'length': f"{instance.length.days+instance.length.seconds//3600 if instance.length.days+instance.length.seconds//3600 else ''}{':' if instance.length.days+instance.length.seconds//3600 > 0 else ''}{'0' if (instance.length.days+instance.length.seconds//3600 > 0) and ((instance.length.seconds//60)%60 < 10) else ''}{(instance.length.seconds//60)%60}:{instance.length.seconds%60:02}",
            'date': instance.date,
            # 'tags': instance.youtuber.tags,
        }