# Generated by Django 4.0.3 on 2024-04-13 21:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0016_remove_tag_user_category_alter_tag_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='categories', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='category',
            unique_together={('user', 'tag')},
        ),
        migrations.AlterUniqueTogether(
            name='tag',
            unique_together={('youtuber', 'category')},
        ),
    ]
