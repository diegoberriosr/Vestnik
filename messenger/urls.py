from django.urls import path
from . import views
from .serializers import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView
)


urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('email_exists/', views.check_email, name='check email'),
    path('register', views.register_user, name='register'),
    path('update/profile', views.edit_profile, name='edit profile'),
    path('users', views.get_users, name='get users'),
    path('conversations', views.get_conversations, name='get conversations'),
    path('conversations/create', views.create_conversation, name='create conversation'),
    path('conversations/messages', views.get_conversation_messages, name='get conversation messages'),
    path('conversations/clear', views.clear_conversation, name='clear conversation'),
    path('groups/members/update', views.update_group_members, name='update group members'),
    path('groups/admins/update', views.update_group_admins, name='update group admins'),
    path('groups/delete', views.delete_group_chat, name='delete group'),
    path('groups/create', views.create_group_chat, name='create group'),
    path('groups/name/update', views.update_group_name, name='update group name'),
    path('messages/starred', views.get_starred_messages, name='starred messages'),
    path('messages/create', views.create_message, name='create message'),
    path('messages/delete', views.delete_message, name='delete message'),
    path('messages/star', views.star_message, name='star message')
]