from django.db import models

from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import UserManager


class Roles(models.Model):
    role_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.role_name
    
class Quest(models.Model):
    quest_name = models.CharField(verbose_name=_('Название квеста'), max_length=255, unique=True)
    quest_address = models.CharField(verbose_name=_('Адрес квеста'), max_length=255)

    quest_rate = models.IntegerField(verbose_name=_('Ставка квеста'))

    def __str__(self):
        return self.quest_name

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(verbose_name=_('Имя пользователя'), max_length=255, unique=True)

    last_name = models.CharField(verbose_name=_('Фамилия пользователя'), max_length=255, blank=True, null=True)
    first_name = models.CharField(verbose_name=_('Имя пользователя'), max_length=255, blank=True, null=True)
    middle_name = models.CharField(verbose_name=_('Отчество пользователя'), max_length=255, blank=True, null=True)

    is_active = models.BooleanField(verbose_name=_('Активный'), help_text=_('Отметьте, если пользователь должен считаться активным. Уберите эту отметку вместо удаления учётной записи.'), default=True)
    is_staff = models.BooleanField(verbose_name=_('Статус персонала'), help_text=_('Отметьте, если пользователь может входить в административную часть сайта.'), default=False)
    is_superuser = models.BooleanField(verbose_name=_('Статус суперпользователя'), help_text=_('Указывает, что пользователь имеет все права без явного их назначения.'), default=False)

    roles = models.ManyToManyField(Roles, verbose_name=_('Роли пользователя'))

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)

    date_joined = models.DateTimeField(verbose_name=_('Дата регистрации пользователя'), default=timezone.now)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.username
   
class Income(models.Model):
    date = models.DateField()
    time = models.TimeField()
    game = models.IntegerField()
    room = models.IntegerField()
    video = models.IntegerField()
    photomagnets = models.IntegerField()
    actor = models.IntegerField()
    total = models.IntegerField(blank=True, null=True)

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)

    def save(self, *args, **kwargs):
        self.total = self.game + self.room + self.video + self.photomagnets + self.actor
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.date)
    
class Salary(models.Model):
    date = models.DateField()

    object = models.CharField(max_length=255)
    value = models.IntegerField()
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return str(self.date)

class ExpensesSubCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class ExpensesCategory(models.Model):
    name = models.CharField(max_length=255)
    sub = models.ManyToManyField(ExpensesSubCategory, blank=True)

    def __str__(self):
        return self.name
        
class Expenses(models.Model):
    date = models.DateField()

    object = models.CharField(max_length=255)
    value = models.IntegerField()

    category = models.ForeignKey(ExpensesCategory, on_delete=models.CASCADE, blank=True, null=True)

    quests = models.ManyToManyField(Quest, blank=True)

    def __str__(self):
        return str(self.date)
    
class QuestForm(models.Model):
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    quest_cost = models.IntegerField()
    package = models.BooleanField()
    add_players = models.IntegerField()
    actor_second_actor = models.IntegerField()
    discount_sum = models.IntegerField()
    discount_desc = models.CharField(max_length=255)
    room_sum = models.IntegerField()
    room_quantity = models.IntegerField()
    room_name = models.CharField(max_length=255)
    video = models.IntegerField()
    photomagnets_not_promo_sum = models.IntegerField()
    photomagnets_not_promo_quantity = models.IntegerField()
    photomagnets_promo_sum = models.IntegerField()
    photomagnets_promo_quantity = models.IntegerField()
    birthday_congr = models.IntegerField()
    easy_work = models.IntegerField()
    night_game = models.IntegerField()
    travel = models.BooleanField()
    administrator = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='administrator_questforms')
    actor = models.ManyToManyField(User, blank=True, related_name='actor_questforms')
    animator = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='animatator_questforms')

    def __str__(self):
        # for actors
        print(self.actor)

        return str(self.quest)
    
class ExpensesForm(models.Model):
    date = models.DateField()

    sum = models.IntegerField()
    name_of_expense = models.CharField(max_length=255)
    quests = models.ManyToManyField(Quest, blank=True)

    def __str__(self):
        return str(self.date)
    
class BonusesPenaltiesForm(models.Model):
    date = models.DateField()
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    bonus = models.IntegerField()
    penaltie = models.IntegerField()

    quests = models.ManyToManyField(Quest, blank=True)

    def __str__(self):
        return str(self.date)
