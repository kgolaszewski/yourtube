# Generated by Django 4.0.3 on 2024-04-10 02:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0012_youtuber_subscribers'),
    ]

    operations = [
        migrations.RenameField(
            model_name='youtuber',
            old_name='name',
            new_name='display_name',
        ),
    ]
