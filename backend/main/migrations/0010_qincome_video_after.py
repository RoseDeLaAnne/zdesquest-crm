# Generated by Django 4.2.4 on 2023-12-14 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_stquest_cashless_payment_after'),
    ]

    operations = [
        migrations.AddField(
            model_name='qincome',
            name='video_after',
            field=models.IntegerField(default=0),
        ),
    ]