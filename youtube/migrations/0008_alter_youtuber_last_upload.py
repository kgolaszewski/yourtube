# Generated by Django 4.0.3 on 2022-03-11 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0007_youtuber_last_upload'),
    ]

    operations = [
        migrations.AlterField(
            model_name='youtuber',
            name='last_upload',
            field=models.CharField(default='', max_length=128),
            preserve_default=False,
        ),
    ]