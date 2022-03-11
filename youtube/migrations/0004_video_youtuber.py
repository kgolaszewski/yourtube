# Generated by Django 4.0.3 on 2022-03-11 18:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0003_video_remove_youtuber_video_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='youtuber',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='videos', to='youtube.youtuber'),
        ),
    ]