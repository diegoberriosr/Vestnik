# Generated by Django 5.0.3 on 2024-03-30 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0009_user_is_online_user_last_seen'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='image',
            field=models.TextField(default=None, null=True),
        ),
    ]