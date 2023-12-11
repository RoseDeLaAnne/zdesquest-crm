# Generated by Django 4.2.4 on 2023-12-10 15:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_remove_qvideo_is_package_qvideo_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='stquest',
            name='administrator_half',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='administrator_half_stquest', to=settings.AUTH_USER_MODEL),
        ),
    ]