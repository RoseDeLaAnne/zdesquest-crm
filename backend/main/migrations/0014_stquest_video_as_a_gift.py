# Generated by Django 4.2.4 on 2023-12-18 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_alter_expensefromtheir_phone_number_for_transfer'),
    ]

    operations = [
        migrations.AddField(
            model_name='stquest',
            name='video_as_a_gift',
            field=models.BooleanField(default=False),
        ),
    ]
