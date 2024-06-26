# Generated by Django 4.0.3 on 2024-04-10 02:27

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0011_alter_video_length'),
    ]

    operations = [
        migrations.AddField(
            model_name='youtuber',
            name='subscribers',
            field=models.ManyToManyField(related_name='subscriptions', related_query_name='subscription', to=settings.AUTH_USER_MODEL),
        ),
    ]
