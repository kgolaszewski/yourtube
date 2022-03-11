from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from youtube import views

router = routers.DefaultRouter()
router.register(r'youtubers', views.YoutuberView, 'youtuber')
router.register(r'videos', views.VideoView, 'video')
router.register(r'tags', views.TagView, 'tag')
router.register(r'feed', views.FeedView, 'feed')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
