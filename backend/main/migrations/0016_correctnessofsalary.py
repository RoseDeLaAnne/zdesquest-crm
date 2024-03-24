# Generated by Django 4.2.4 on 2024-03-14 13:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_alter_user_quests_for_videos'),
    ]

    operations = [
        migrations.CreateModel(
            name='CorrectnessOfSalary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_correct', models.BooleanField(null=True)),
                ('stquest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stquest')),
            ],
        ),
    ]