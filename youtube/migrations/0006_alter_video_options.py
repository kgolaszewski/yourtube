# Generated by Django 4.0.3 on 2022-03-11 19:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0005_alter_video_youtuber'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='video',
            options={'ordering': ['-date', 'title']},
        ),
    ]
