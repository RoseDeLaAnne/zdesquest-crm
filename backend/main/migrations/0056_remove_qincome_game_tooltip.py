# Generated by Django 4.2.4 on 2023-10-13 08:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0055_qincome_game_tooltip'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='qincome',
            name='game_tooltip',
        ),
    ]
