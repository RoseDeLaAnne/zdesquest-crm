# Generated by Django 4.2.4 on 2023-10-12 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0047_remove_questversion_cost_weekdays_with_package_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='qincome',
            name='is_package',
            field=models.BooleanField(default=False),
        ),
    ]
