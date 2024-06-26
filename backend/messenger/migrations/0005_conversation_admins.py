# Generated by Django 5.0.3 on 2024-03-14 20:20

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0004_conversation_is_group_chat_conversation_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='admins',
            field=models.ManyToManyField(related_name='admin_conversations', to=settings.AUTH_USER_MODEL),
        ),
    ]
