from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

# Create your models here.

class CustomUserManager(BaseUserManager):

    def create_user(self, email, name, password, **other_fields):
        if not email:
            raise ValueError(_('You must provide an e-mail address.'))
        if not name:
            raise ValueError(_('You must provide a name.'))
        
        email = self.normalize_email
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

class User(AbstractBaseUser):
    email = models.EmailField(_("User's email"), unique=True)
    name = models.CharField(max_length=64)
    info = models.CharField(max_length=100, blank=True, null=True)
    pfp = models.TextField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['complete_name']

    objects = CustomUserManager()