# Generated by Django 4.2.3 on 2023-08-08 10:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_income_total'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('quest_cost', models.IntegerField()),
                ('package', models.BooleanField()),
                ('add_players', models.IntegerField()),
                ('actor_second_actor', models.IntegerField()),
                ('discount_sum', models.IntegerField()),
                ('discount_desc', models.CharField(max_length=255)),
                ('room_sum', models.IntegerField()),
                ('room_quantity', models.IntegerField()),
                ('room_name', models.CharField(max_length=255)),
                ('video', models.IntegerField()),
                ('photomagnets_not_promo_sum', models.IntegerField()),
                ('photomagnets_not_promo_quantity', models.IntegerField()),
                ('photomagnets_promo_sum', models.IntegerField()),
                ('photomagnets_promo_quantity', models.IntegerField()),
                ('birthday_congr', models.IntegerField()),
                ('easy_work', models.IntegerField()),
                ('night_game', models.IntegerField()),
                ('travel', models.BooleanField()),
                ('actor', models.ManyToManyField(blank=True, related_name='actor_questforms', to=settings.AUTH_USER_MODEL)),
                ('administrator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='administrator_questforms', to=settings.AUTH_USER_MODEL)),
                ('animator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='animatator_questforms', to=settings.AUTH_USER_MODEL)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.quest')),
            ],
        ),
        migrations.CreateModel(
            name='ExpensesForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('sum', models.IntegerField()),
                ('name_of_expense', models.CharField(max_length=255)),
                ('quests', models.ManyToManyField(blank=True, to='main.quest')),
            ],
        ),
        migrations.CreateModel(
            name='BonusesPenaltiesForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('bonus', models.IntegerField()),
                ('penaltie', models.IntegerField()),
                ('employee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('quests', models.ManyToManyField(blank=True, to='main.quest')),
            ],
        ),
    ]
