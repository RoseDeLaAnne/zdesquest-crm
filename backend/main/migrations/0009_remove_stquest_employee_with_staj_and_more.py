# Generated by Django 4.2.4 on 2023-10-17 09:15

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_stexpense_quest_stexpense_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stquest',
            name='employee_with_staj',
        ),
        migrations.AddField(
            model_name='stquest',
            name='employees_first_time',
            field=models.ManyToManyField(blank=True, related_name='employees_first_time_stquest', to=settings.AUTH_USER_MODEL),
        ),
    ]
