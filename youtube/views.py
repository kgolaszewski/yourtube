from django.shortcuts import render, get_object_or_404
from django.db.models import F

from rest_framework import viewsets 
from rest_framework.pagination import PageNumberPagination, CursorPagination 
from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    CustomUserSerializer, 
    YoutuberSerializer, 
    VideoSerializer, 
    TagSerializer,
    FeedSerializer,
    UserRegisterSerializer,
    UserSubscriptionSerializer,
    ProfileSerializer,
    CategorySerializer
)
from .models import (
    CustomUser, 
    Youtuber, 
    Video, 
    Tag, 
    Category,
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 200
    page_size_query_param = 'page_size'
    max_page_size = 1000

# Writable ModelViewSets
class UserView(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    pagination_class = StandardResultsSetPagination

# @permission_classes([IsAuthenticated])
class YoutuberView(viewsets.ModelViewSet):
    serializer_class = YoutuberSerializer
    queryset = Youtuber.objects.all()
    pagination_class = StandardResultsSetPagination

class VideoView(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    pagination_class = StandardResultsSetPagination

class TagView(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
    pagination_class = StandardResultsSetPagination

class CategoryView(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    pagination_class = StandardResultsSetPagination

class ProfileView(viewsets.ViewSet):
    def list(self, request):
        categories = [x.tag for x in request.user.categories.all()]
        queryset = Tag.objects.filter(category__tag__in=categories)
        serializer = ProfileSerializer(queryset, context={'request': request})
        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class FeedView(viewsets.ReadOnlyModelViewSet):
    serializer_class = FeedSerializer
    queryset = Video.objects.filter(video_id=F('youtuber__last_upload'))
    pagination_class = StandardResultsSetPagination

    def list(self, request):
        user = request.user
        most_recent_subbed_vid_ids = [ x.last_upload for x in user.subscriptions.all() ]
        queryset = Video.objects.filter(video_id__in=most_recent_subbed_vid_ids).order_by('-date')
        serializer = FeedSerializer(queryset, many=True)
        return Response(serializer.data)

    # def retrieve(self, request, pk=None):
    #     queryset = Video.objects.filter(youtuber__tags__category=pk).filter(video_id=F('youtuber__last_upload')).order_by('-date')
    #     serializer = FeedSerializer(queryset, many=True)
    #     return Response(serializer.data)

@api_view(["POST"])
def createUser(request):
  serializer = UserRegisterSerializer(data=request.data)
  data = {}
  if serializer.is_valid():
    user = serializer.save()
    data = {
      "response": "Successfully registered new user.",
      "email": user.email,
      "username": user.username,
    }
  else:
     data = serializer.errors
  
  return Response(data)

@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def subscription_view(request):
    user = request.user

    if request.method == "GET":
        serializer = UserSubscriptionSerializer(user)
        return Response(serializer.data)

    elif request.method == "POST": 
        youtuber = Youtuber.objects.get(username=request.data["youtuber"])
        user.subscriptions.add(youtuber)
        data = { "response": "Success", "user": user.username, "youtuber": youtuber.username, }

        return Response(data)
    
    elif request.method == "DELETE":
        print(request.data)
        youtuber = Youtuber.objects.get(username=request.data["youtuber"])
        user.subscriptions.remove(youtuber)
        data = { "response": "Success", "user": user.username, "youtuber": youtuber.username, }

        return Response(data)
