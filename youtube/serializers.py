from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser, Youtuber, Video, Tag

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
   serializer_class = MyTokenObtainPairSerializer

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
        length_pt1 = f"{instance.length.days+instance.length.seconds//3600 if instance.length.days+instance.length.seconds//3600 else ''}"
        length_pt2 = f"{':' if instance.length.days+instance.length.seconds//3600 > 0 else ''}"
        length_pt3 = f"{'0' if (instance.length.days+instance.length.seconds//3600 > 0) and ((instance.length.seconds//60)%60 < 10) else ''}"
        length_pt4 = f"{(instance.length.seconds//60)%60}:{instance.length.seconds%60:02}"
        return {
            'name': instance.youtuber.name,
            'imagename': instance.youtuber.username,
            'channel': instance.youtuber.channel,
            'title': instance.title,
            'url': f"https://youtube.com/watch?v={instance.video_id}",
            'id': instance.video_id,
            'length': f"{length_pt1}{length_pt2}{length_pt3}{length_pt4}",
            'date': instance.date,
            # 'tags': instance.youtuber.tags,
        }