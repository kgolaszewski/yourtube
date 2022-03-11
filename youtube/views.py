from django.shortcuts import render, get_object_or_404

from rest_framework import viewsets 
from rest_framework.pagination import PageNumberPagination, CursorPagination 
from rest_framework.response import Response

from .serializers import CustomUserSerializer, YoutuberSerializer, VideoSerializer, TagSerializer
from .models import CustomUser, Youtuber, Video, Tag 

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 200
    page_size_query_param = 'page_size'
    max_page_size = 1000

# Writable ModelViewSets
class UserView(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    pagination_class = StandardResultsSetPagination

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
