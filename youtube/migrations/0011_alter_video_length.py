# Generated by Django 4.0.3 on 2022-03-16 19:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0010_video_length'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='length',
            field=models.DurationField(null=True),
        ),
    ]
