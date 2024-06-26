# Generated by Django 4.0.3 on 2022-03-11 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0002_youtuber_tag'),
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('video_id', models.CharField(max_length=128, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=128)),
                ('date', models.DateField()),
            ],
        ),
        migrations.RemoveField(
            model_name='youtuber',
            name='video_date',
        ),
        migrations.RemoveField(
            model_name='youtuber',
            name='video_name',
        ),
    ]
