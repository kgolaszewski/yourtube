# Generated by Django 4.0.3 on 2022-03-11 17:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Youtuber',
            fields=[
                ('username', models.CharField(max_length=128, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128)),
                ('channel', models.CharField(max_length=128)),
                ('video_name', models.CharField(max_length=128)),
                ('video_date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=128)),
                ('youtuber', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='youtube.youtuber')),
            ],
        ),
    ]
