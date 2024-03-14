from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext as _

# Create your models here.

class CustomUserManager(BaseUserManager):

    def create_user(self, email, name, password, **other_fields):
        if not email:
            raise ValueError(_('You must provide an e-mail address.'))
        if not name:
            raise ValueError(_('You must provide a name.'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')
        

        return self.create_user(email, name, password, **other_fields) 

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email_address"), unique=True)
    name = models.CharField(max_length=64)
    info = models.CharField(max_length=100, blank=True, null=True)
    pfp = models.TextField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()
    
    def serialize(self):
        return {
            'id' : self.id,
            'name' : self.name,
            'info' : self.info,
            'pfp' : self.pfp
        }


class Conversation(models.Model):
    name = models.CharField(max_length=100, null=True)
    is_group_chat = models.BooleanField(default=False)
    members = models.ManyToManyField(User, related_name='conversations')
    active_members = models.ManyToManyField(User, related_name='active_conversations')
    archived_by = models.ManyToManyField(User, related_name='archived_conversations')
    
    def serialize(self, user):

        return {
            'id' : self.id,
            'name' : self.name,
            'is_group_chat' : self.is_group_chat,
            'partners' : [member.serialize() for member in self.members.all() if member != user],
            'messages' : [message.serialize(user) for message in self.messages.all()],
            'unread_messages' : len([message for message in self.messages.all() if user not in message.read_by.all()])
        }
    
    def inbox_serialize(self, user):
        return {
            'id' : self.id,
            'name' : self.name,
            'is_group_chat' : self.is_group_chat,
            'partners' : [member.serialize() for member in self.members.all() if member != user],
            'unread_messages' : len([message for message in self.messages.all() if user not in message.read_by.all()]),
            'last_message' : self.messages.last().serialize(user) if self.messages.last() else None
        }


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='messages', null=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    content = models.CharField(max_length=4000)
    read_by = models.ManyToManyField(User, related_name='read_messages')
    cleared_by = models.ManyToManyField(User, related_name='cleared_messages')
    starred_by = models.ManyToManyField(User, related_name='starred_messages')

    def serialize(self, user):
        return {
            'id' : self.id,
            'conversation_id' : self.conversation.id,
            'sender_id' : self.sender.id,
            'content' : self.content,
            'read' : user in self.read_by.all(),
            'stared' : user in self.starred_by.all()
        }