# Generated by Django 4.2.4 on 2023-09-14 16:00

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0018_rename_description_stexpense_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='stexpense',
            name='paid_tax',
            field=models.ManyToManyField(blank=True, related_name='paid_tax_users', to=settings.AUTH_USER_MODEL),
        ),
    ]