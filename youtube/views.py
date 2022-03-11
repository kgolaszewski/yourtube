from django.shortcuts import render, get_object_or_404
from django.db.models import Q, F

from rest_framework import viewsets 
from rest_framework.pagination import PageNumberPagination, CursorPagination 
from rest_framework.response import Response

from .serializers import (CustomUserSerializer, 
    YoutuberSerializer, 
    VideoSerializer, 
    TagSerializer,
    FeedSerializer)
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

class FeedView(viewsets.ReadOnlyModelViewSet):
    serializer_class = FeedSerializer
    queryset = Youtuber.objects.all()
    pagination_class = StandardResultsSetPagination

class FeedView(viewsets.ReadOnlyModelViewSet):
    serializer_class = FeedSerializer
    queryset = Video.objects.filter(video_id=F('youtuber__last_upload')).order_by('-date')
    pagination_class = StandardResultsSetPagination


# class FeedView(viewsets.ReadOnlyModelViewSet):

#     def list(self, request):
#         queryset = Youtuber.objects.all()
#         serializer_class = FeedSerializer
#         pagination_class = StandardResultsSetPagination
#         return Response(serializer.data)

#     def retrieve(self, request, username=None):
#         queryset = Youtuber.objects.all()
#         youtuber = get_object_or_404(queryset, username=username)
#         serializer_class = FeedSerializer
#         pagination_class = StandardResultsSetPagination
#         return Response(serializer.data)


