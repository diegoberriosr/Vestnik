# Generated by Django 5.0.3 on 2024-05-06 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0010_message_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='pfp',
            field=models.TextField(default='https://images.nightcafe.studio//assets/profile.png?tr=w-1600,c-at_max'),
        ),
    ]
