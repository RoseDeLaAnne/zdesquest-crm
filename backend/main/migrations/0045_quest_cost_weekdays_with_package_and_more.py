# Generated by Django 4.2.4 on 2023-10-12 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0044_questversion_cost_weekdays_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='quest',
            name='cost_weekdays_with_package',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='quest',
            name='cost_weekends_with_package',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]