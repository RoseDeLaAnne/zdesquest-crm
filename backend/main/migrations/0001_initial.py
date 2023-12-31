# Generated by Django 4.2.4 on 2023-11-04 09:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Адрес электронной почты')),
                ('phone_number', models.CharField(blank=True, max_length=18, null=True, unique=True, verbose_name='Номер телефона')),
                ('last_name', models.CharField(max_length=255, verbose_name='Фамилия')),
                ('first_name', models.CharField(max_length=255, verbose_name='Имя')),
                ('middle_name', models.CharField(max_length=255, verbose_name='Отчество')),
                ('is_active', models.BooleanField(default=True, help_text='Отметьте, если пользователь должен считаться активным. Уберите эту отметку вместо удаления учётной записи.', verbose_name='Активный')),
                ('is_staff', models.BooleanField(default=False, help_text='Отметьте, если пользователь может входить в административную часть сайта.', verbose_name='Статус персонала')),
                ('is_superuser', models.BooleanField(default=False, help_text='Указывает, что пользователь имеет все права без явного их назначения.', verbose_name='Статус суперпользователя')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата регистрации')),
                ('date_of_birth', models.DateField(blank=True, null=True, verbose_name='Дата рождения')),
                ('internship_period_start', models.DateField(blank=True, null=True)),
                ('internship_period_end', models.DateField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Quest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('cost_weekdays', models.IntegerField(default=0)),
                ('cost_weekends', models.IntegerField(default=0)),
                ('cost_weekdays_with_package', models.IntegerField(blank=True, null=True)),
                ('cost_weekends_with_package', models.IntegerField(blank=True, null=True)),
                ('administrator_rate', models.IntegerField(blank=True, null=True)),
                ('actor_rate', models.IntegerField(blank=True, null=True)),
                ('animator_rate', models.IntegerField(blank=True, null=True)),
                ('duration_in_minute', models.IntegerField(blank=True, null=True)),
                ('parent_quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='quest_parent_quest', to='main.quest')),
                ('special_versions', models.ManyToManyField(blank=True, related_name='quest_special_versions', to='main.quest')),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='STExpense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('name', models.CharField(default=0, max_length=255)),
                ('amount', models.IntegerField(default=0)),
                ('description', models.CharField(default=0, max_length=255)),
                ('paid_from', models.CharField(blank=True, choices=[('work_card', 'рабочая карта'), ('own', 'свои'), ('cash_register', 'касса')], max_length=255, null=True)),
                ('attachment', models.ImageField(blank=True, null=True, upload_to='photos/')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stexpense_created_by', to=settings.AUTH_USER_MODEL)),
                ('employees', models.ManyToManyField(blank=True, related_name='employees_users', to=settings.AUTH_USER_MODEL)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stexpense_quest', to='main.quest')),
                ('quests', models.ManyToManyField(blank=True, related_name='stexpense_quests', to='main.quest')),
            ],
        ),
        migrations.CreateModel(
            name='STExpenseCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('latin_name', models.CharField(blank=True, max_length=255, null=True, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='WorkCardExpense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.IntegerField()),
                ('description', models.CharField(max_length=255)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.quest')),
                ('stexpense', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stexpense')),
            ],
        ),
        migrations.CreateModel(
            name='STQuest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('time', models.TimeField(default=django.utils.timezone.now)),
                ('quest_cost', models.IntegerField()),
                ('add_players', models.IntegerField(default=0)),
                ('actor_or_second_actor_or_animator', models.IntegerField(default=0)),
                ('discount_sum', models.IntegerField(default=0)),
                ('discount_desc', models.CharField(default='', max_length=255)),
                ('room_sum', models.IntegerField(default=0)),
                ('room_sum_after', models.IntegerField(default=0)),
                ('room_sum_total', models.IntegerField(default=0)),
                ('room_quantity', models.IntegerField(default=0)),
                ('video', models.IntegerField(default=0)),
                ('video_after', models.IntegerField(default=0)),
                ('video_total', models.IntegerField(default=0)),
                ('photomagnets_quantity', models.IntegerField(default=0)),
                ('photomagnets_quantity_after', models.IntegerField(default=0)),
                ('photomagnets_quantity_total', models.IntegerField(default=0)),
                ('photomagnets_sum', models.IntegerField(default=0)),
                ('birthday_congr', models.IntegerField(default=0)),
                ('easy_work', models.IntegerField(default=0)),
                ('night_game', models.IntegerField(default=0)),
                ('is_package', models.BooleanField(default=False)),
                ('is_video_review', models.BooleanField(default=False)),
                ('cash_payment', models.IntegerField(default=0)),
                ('cashless_payment', models.IntegerField(default=0)),
                ('cash_delivery', models.IntegerField(default=0)),
                ('cashless_delivery', models.IntegerField(default=0)),
                ('cash_payment_after', models.IntegerField(default=0)),
                ('cashless_payment_after', models.IntegerField(default=0)),
                ('cash_delivery_after', models.IntegerField(default=0)),
                ('cashless_delivery_after', models.IntegerField(default=0)),
                ('cash_payment_total', models.IntegerField(default=0)),
                ('cashless_payment_total', models.IntegerField(default=0)),
                ('cash_delivery_total', models.IntegerField(default=0)),
                ('cashless_delivery_total', models.IntegerField(default=0)),
                ('prepayment', models.IntegerField(default=0)),
                ('client_name', models.CharField(default='', max_length=255)),
                ('actors', models.ManyToManyField(blank=True, related_name='actors_stquest', to=settings.AUTH_USER_MODEL)),
                ('actors_half', models.ManyToManyField(blank=True, related_name='actors_half_stquest', to=settings.AUTH_USER_MODEL)),
                ('administrator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='administrator_stquest', to=settings.AUTH_USER_MODEL)),
                ('animator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='animatator_stquest', to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_by', to=settings.AUTH_USER_MODEL)),
                ('employees_first_time', models.ManyToManyField(blank=True, related_name='employees_first_time_stquest', to=settings.AUTH_USER_MODEL)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='main.quest')),
                ('room_employee_name', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='room_employee_stquest', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='STExpenseSubCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('latin_name', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stexpensecategory')),
            ],
        ),
        migrations.AddField(
            model_name='stexpense',
            name='stquest',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stquest'),
        ),
        migrations.AddField(
            model_name='stexpense',
            name='sub_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.stexpensesubcategory'),
        ),
        migrations.AddField(
            model_name='stexpense',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stexpense_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='stexpense',
            name='who_paid',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='who_paid_st_expense', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='STBonusPenalty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('type', models.CharField(choices=[('bonus', 'бонус'), ('penalty', 'штраф')], default='bonus', max_length=255)),
                ('amount', models.IntegerField(default=0)),
                ('name', models.CharField(default='', max_length=255)),
                ('quests', models.ManyToManyField(blank=True, to='main.quest')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='QVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('time', models.TimeField(default=django.utils.timezone.now)),
                ('client_name', models.CharField(max_length=255)),
                ('sent', models.BooleanField()),
                ('is_package', models.BooleanField(default=False)),
                ('note', models.CharField(default='', max_length=255)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.quest')),
                ('stquest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stquest')),
            ],
        ),
        migrations.CreateModel(
            name='QSalary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.IntegerField()),
                ('name', models.CharField(max_length=255)),
                ('sub_category', models.CharField(default='', max_length=255)),
                ('st_expense', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stexpense')),
                ('stquest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stquest')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='QIncome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('time', models.TimeField(default=django.utils.timezone.now)),
                ('game', models.IntegerField(default=0)),
                ('discount_sum', models.IntegerField(default=0)),
                ('discount_desc', models.CharField(default='', max_length=255)),
                ('easy_work', models.IntegerField(default=0)),
                ('room', models.IntegerField(default=0)),
                ('video', models.IntegerField(default=0)),
                ('photomagnets', models.IntegerField(default=0)),
                ('actor', models.IntegerField(default=0)),
                ('total', models.IntegerField(blank=True, null=True)),
                ('paid_cash', models.IntegerField(default=0)),
                ('paid_non_cash', models.IntegerField(default=0)),
                ('is_package', models.BooleanField(default=False)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.quest')),
                ('stquest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stquest')),
            ],
        ),
        migrations.CreateModel(
            name='QCashRegister',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.IntegerField()),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('operation', models.CharField(choices=[('plus', 'плюс'), ('minus', 'минус')], default='plus', max_length=255)),
                ('status', models.CharField(choices=[('reset', 'обнулено'), ('not_reset', 'не обнулено')], default='not_reset', max_length=255)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.quest')),
                ('stexpense', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stexpense')),
                ('stquest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stquest')),
            ],
        ),
        migrations.CreateModel(
            name='ExpenseFromTheir',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('amount', models.IntegerField()),
                ('description', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('paid', 'выплачено'), ('not_paid', 'не выплачено')], default='not_paid', max_length=255)),
                ('quest', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.quest')),
                ('stexpense', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.stexpense')),
                ('who_paid', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='internship_quest',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_internship_quest', to='main.quest'),
        ),
        migrations.AddField(
            model_name='user',
            name='quest',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_quest', to='main.quest'),
        ),
        migrations.AddField(
            model_name='user',
            name='roles',
            field=models.ManyToManyField(to='main.role', verbose_name='Роли'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
    ]
