# Generated by Django 5.0.3 on 2024-03-14 20:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0006_message_is_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]