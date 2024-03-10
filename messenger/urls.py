from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('conversations', views.create_conversation, name='get conversations'),
    path('conversations/create', views.create_conversation, name='create conversation'),
    path('conversations/clear', views.clear_conversation, name='clear conversation'),
    path('messages/starred', views.get_starred_messages, name='starred messages'),
    path('messages/create', views.create_message, name='create message'),
    path('messages/delete', views.delete_message, name='delete message'),
    path('messages/star', views.star_message, name='star message')

]