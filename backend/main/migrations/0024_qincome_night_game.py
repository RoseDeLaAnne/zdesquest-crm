# Generated by Django 4.2.4 on 2024-03-26 08:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0023_remove_stquest_created_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='qincome',
            name='night_game',
            field=models.IntegerField(default=0),
        ),
    ]