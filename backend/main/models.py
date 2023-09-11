from django.db import models

from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import UserManager


class Role(models.Model):
    name = models.CharField(max_length=255, unique=True)
    latin_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Quest(models.Model):
    name = models.CharField(max_length=255, unique=True)
    latin_name = models.CharField(max_length=255, unique=True, blank=True, null=True)
    address = models.CharField(max_length=255)

    administrator_rate = models.IntegerField()
    actor_rate = models.IntegerField()
    animator_rate = models.IntegerField(blank=True, null=True)

    duration_minute = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        self.animator_rate = self.actor_rate + 50
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class STExpenseCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    latin_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class STExpenseSubCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    latin_name = models.CharField(max_length=255, unique=True)

    category = models.ForeignKey(
        STExpenseCategory, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        verbose_name=_("Имя пользователя"), max_length=255, unique=True
    )

    last_name = models.CharField(
        verbose_name=_("Фамилия пользователя"), max_length=255, blank=True, null=True
    )
    first_name = models.CharField(
        verbose_name=_("Имя пользователя"), max_length=255, blank=True, null=True
    )
    # middle_name = models.CharField(
    #     verbose_name=_("Отчество пользователя"), max_length=255, blank=True, null=True
    # )

    is_active = models.BooleanField(
        verbose_name=_("Активный"),
        help_text=_(
            "Отметьте, если пользователь должен считаться активным. Уберите эту отметку вместо удаления учётной записи."
        ),
        default=True,
    )
    is_staff = models.BooleanField(
        verbose_name=_("Статус персонала"),
        help_text=_(
            "Отметьте, если пользователь может входить в административную часть сайта."
        ),
        default=False,
    )
    is_superuser = models.BooleanField(
        verbose_name=_("Статус суперпользователя"),
        help_text=_(
            "Указывает, что пользователь имеет все права без явного их назначения."
        ),
        default=False,
    )
    # roles = models.ManyToManyField(
    #     Role, verbose_name=_("Роли пользователя"), blank=True
    # )

    quest = models.ForeignKey(Quest, on_delete=models.SET_NULL, blank=True, null=True)

    date_joined = models.DateTimeField(
        verbose_name=_("Дата регистрации пользователя"), default=timezone.now
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.username


class STExpense(models.Model):
    PAID_FROM = [
        ("work_card", "Рабочая карта"),
        ("their", "Свои"),
        ("cash_register", "Касса"),
    ]

    date = models.DateField()

    amount = models.IntegerField()
    name = models.CharField(max_length=255)

    sub_category = models.ForeignKey(
        STExpenseSubCategory, on_delete=models.SET_NULL, blank=True, null=True
    )

    quests = models.ManyToManyField(Quest, blank=True)

    paid_from = models.CharField(choices=PAID_FROM, default="work_card", max_length=255)    

    who_paid = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    who_paid_amount = models.IntegerField(blank=True, null=True)

    image = models.FileField(upload_to="photos/", blank=True, null=True)

    def __str__(self):
        return str(self.date)


class STQuest(models.Model):
    quest = models.ForeignKey(Quest, on_delete=models.SET_NULL, blank=True, null=True)

    date = models.DateField()
    time = models.TimeField()
    quest_cost = models.IntegerField()    
    add_players = models.IntegerField(blank=True, null=True)
    actor_second_actor = models.IntegerField(blank=True, null=True)
    discount_sum = models.IntegerField(blank=True, null=True)
    discount_desc = models.CharField(blank=True, null=True, max_length=255)
    room_sum = models.IntegerField(blank=True, null=True)
    room_quantity = models.IntegerField(blank=True, null=True)
    room_employee_name = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="room_employee_stquest",
    )
    video = models.IntegerField(blank=True, null=True)
    photomagnets_quantity = models.IntegerField(blank=True, null=True)
    photomagnets_sum = models.IntegerField(blank=True, null=True)
    birthday_congr = models.IntegerField(blank=True, null=True)
    easy_work = models.IntegerField(blank=True, null=True)
    night_game = models.IntegerField(blank=True, null=True)    
    administrator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="administrator_stquest",
    )
    actors = models.ManyToManyField(User, blank=True, related_name="actors_stquest")
    actors_half = models.ManyToManyField(User, blank=True, related_name="actors_half_stquest")
    animator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="animatator_stquest",
    )
    package = models.BooleanField(blank=True, null=True)
    travel = models.BooleanField(blank=True, null=True)

    cash_payment = models.IntegerField(blank=True, null=True)
    cashless_payment = models.IntegerField(blank=True, null=True)
    cash_delivery = models.IntegerField(blank=True, null=True)
    cashless_delivery = models.IntegerField(blank=True, null=True)
    prepayment = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        photomagnets_promo = self.photomagnets_quantity // 2
        photomagnets_not_promo = self.photomagnets_quantity - photomagnets_promo
        self.photomagnets_sum = photomagnets_not_promo * 250 + photomagnets_promo * 150
        super().save(*args, **kwargs)

    def __str__(self):
        # for actors
        # print(self.actors)

        return str(self.quest)


class STBonusPenalty(models.Model):
    TYPE = [
        ("bonus", "Бонус"),
        ("penalty", "Штраф"),
    ]

    date = models.DateField()

    amount = models.IntegerField()
    name = models.CharField(max_length=255)

    type = models.CharField(choices=TYPE, default="bonus", max_length=255)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    quests = models.ManyToManyField(Quest, blank=True)

    def __str__(self):
        return str(self.date)
    
# class STBonus(models.Model):
#     date = models.DateField()

#     amount = models.IntegerField()
#     name = models.CharField(max_length=255)

#     user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

#     quests = models.ManyToManyField(Quest, blank=True)

#     def __str__(self):
#         return str(self.date)


# class STPenalty(models.Model):
#     date = models.DateField()

#     amount = models.IntegerField()
#     name = models.CharField(max_length=255)

#     user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

#     quests = models.ManyToManyField(Quest, blank=True)

#     def __str__(self):
#         return str(self.date)


class QIncome(models.Model):
    date = models.DateField()
    time = models.TimeField()
    game = models.IntegerField()
    room = models.IntegerField()
    video = models.IntegerField()
    photomagnets = models.IntegerField()
    actor = models.IntegerField()
    total = models.IntegerField(blank=True, null=True)

    paid_cash = models.IntegerField(blank=True, null=True)
    paid_non_cash = models.IntegerField(blank=True, null=True)

    quest = models.ForeignKey(Quest, on_delete=models.SET_NULL, blank=True, null=True)

    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )

    def save(self, *args, **kwargs):
        self.total = self.game + self.room + self.video + self.photomagnets + self.actor
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.date)


class QSalary(models.Model):
    date = models.DateField()

    amount = models.IntegerField()
    name = models.CharField(max_length=255)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date)


class QCashRegister(models.Model):
    OPERATION = [
        ("plus", "Плюс"),
        ("minus", "Минус"),
    ]

    STATUS = [
        ("reset", "Обнулено"),
        ("not_reset", "Не обнулено"),
    ]

    date = models.DateField()

    amount = models.IntegerField()
    description = models.CharField(max_length=255, blank=True, null=True)

    operation = models.CharField(choices=OPERATION, default="plus", max_length=255)
    status = models.CharField(choices=STATUS, default="not_reset", max_length=255)

    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )
    quest = models.ForeignKey(
        Quest, on_delete=models.CASCADE, blank=True, null=True
    )
    stexpense = models.ForeignKey(
        STExpense, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date)


class WorkCardExpense(models.Model):
    date = models.DateField()

    amount = models.IntegerField()
    description = models.CharField(max_length=255)

    quest = models.ForeignKey(
        Quest, on_delete=models.CASCADE, blank=True, null=True
    )
    stexpense = models.ForeignKey(
        STExpense, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date)


class ExpenseFromTheir(models.Model):
    STATUS = [
        ("paid", "Выплачено"),
        ("not_paid", "Не выплачено"),
    ]    

    date = models.DateField()

    amount = models.IntegerField()
    description = models.CharField(max_length=255)
    
    who_paid = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    status = models.CharField(choices=STATUS, default="not_paid", max_length=255)

    quest = models.ForeignKey(
        Quest, on_delete=models.CASCADE, blank=True, null=True
    )
    stexpense = models.ForeignKey(
        STExpense, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date)
