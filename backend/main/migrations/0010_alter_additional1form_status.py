# Generated by Django 4.2.3 on 2023-08-15 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_additional1form'),
    ]

    operations = [
        migrations.AlterField(
            model_name='additional1form',
            name='status',
            field=models.IntegerField(choices=[(-1, 'Отклонена'), (0, 'В ожидании'), (1, 'Одобрена')], default=0, verbose_name='Статус'),
        ),
    ]
