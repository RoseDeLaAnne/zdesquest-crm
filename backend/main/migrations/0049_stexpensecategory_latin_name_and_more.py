# Generated by Django 4.2.4 on 2023-10-12 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0048_qincome_is_package'),
    ]

    operations = [
        migrations.AddField(
            model_name='stexpensecategory',
            name='latin_name',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='stexpensesubcategory',
            name='latin_name',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]