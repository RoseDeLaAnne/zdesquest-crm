# Generated by Django 4.2.4 on 2024-03-14 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_remove_correctnessofsalary_stquest_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='qsalary',
            name='is_correct',
            field=models.BooleanField(null=True),
        ),
        migrations.DeleteModel(
            name='CorrectnessOfSalary',
        ),
    ]