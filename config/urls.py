from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from youtube import views

from rest_framework_simplejwt.views import (
    # TokenObtainPairView,
    TokenRefreshView,
)

from youtube.serializers import MyTokenObtainPairView

router = routers.DefaultRouter()
router.register(r'youtubers', views.YoutuberView, 'youtuber')
router.register(r'videos', views.VideoView, 'video')
router.register(r'tags', views.TagView, 'tag')
router.register(r'feed', views.FeedView, 'feed')
router.register(r'users', views.UserView, 'user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/signup/', views.createUser),

    path('api/subscribed/', views.get_youtube_subscriptions),
    path('api/subscribe/', views.subscribe_to_youtuber),
    path('api/unsubscribe/', views.unsubscribe_from_youtuber)

]
