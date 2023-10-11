# Generated by Django 4.2.4 on 2023-10-11 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0040_stquest_room_sum_after'),
    ]

    operations = [
        migrations.AddField(
            model_name='stquest',
            name='cash_delivery_total',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='stquest',
            name='cash_payment_total',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='stquest',
            name='cashless_delivery_total',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='stquest',
            name='cashless_payment_total',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='stquest',
            name='photomagnets_quantity_total',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='stquest',
            name='room_sum_total',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='stquest',
            name='video_total',
            field=models.IntegerField(default=0),
        ),
    ]
