from django.db import models

from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import UserManager


class Role(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


# class QuestVersion(models.Model):
#     name = models.CharField(max_length=255, unique=True)

#     cost_weekdays = models.IntegerField(default=0)
#     cost_weekends = models.IntegerField(default=0)
#     cost_weekdays_with_package = models.IntegerField(default=0)
#     cost_weekends_with_package = models.IntegerField(default=0)

#     def __str__(self):
#         return self.name


class Quest(models.Model):
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    cost_weekdays = models.IntegerField(default=0)
    cost_weekends = models.IntegerField(default=0)
    cost_weekdays_with_package = models.IntegerField(blank=True, null=True)
    cost_weekends_with_package = models.IntegerField(blank=True, null=True)

    administrator_rate = models.IntegerField(blank=True, null=True)
    actor_rate = models.IntegerField(blank=True, null=True)
    animator_rate = models.IntegerField(blank=True, null=True)

    duration_in_minute = models.IntegerField(blank=True, null=True)

    parent_quest = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="quest_parent_quest",
    )
    special_versions = models.ManyToManyField(
        "self", blank=True, symmetrical=False, related_name="quest_special_versions"
    )

    def save(self, *args, **kwargs):
        if self.actor_rate is not None:
            self.animator_rate = int(self.actor_rate) + 50
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class STExpenseCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    latin_name = models.CharField(max_length=255, unique=True, blank=True, null=True)

    # sub_categories = models.ManyToManyField(STExpenseSubCategory, blank=True)

    def __str__(self):
        return self.name


class STExpenseSubCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    latin_name = models.CharField(max_length=255, unique=True, blank=True, null=True)

    category = models.ForeignKey(
        STExpenseCategory, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    BANKS = [
        ("sberbank", "сбербанк"),
        ("tinkoff", "тинькофф"),
        ("alfabank", "альфа-банк"),
    ]

    email = models.EmailField(verbose_name=_("Адрес электронной почты"), unique=True)
    phone_number = models.CharField(
        verbose_name=_("Номер телефона"),
        max_length=18,
        unique=True,
        blank=True,
        null=True,
    )

    last_name = models.CharField(verbose_name=_("Фамилия"), max_length=255)
    first_name = models.CharField(verbose_name=_("Имя"), max_length=255)
    middle_name = models.CharField(verbose_name=_("Отчество"), max_length=255)

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
    roles = models.ManyToManyField(Role, verbose_name=_("Роли"))

    quest = models.ForeignKey(
        Quest,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="user_quest",
    )

    date_joined = models.DateTimeField(
        verbose_name=_("Дата регистрации"), default=timezone.now
    )
    date_of_birth = models.DateField(
        verbose_name=_("Дата рождения"), blank=True, null=True
    )

    internship_period_start = models.DateField(blank=True, null=True)
    internship_period_end = models.DateField(blank=True, null=True)

    internship_quest = models.ForeignKey(
        Quest,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="user_internship_quest",
    )

    phone_number_for_transfer = models.CharField(
        verbose_name=_("Номер телефона для перевода"),
        max_length=18,
        unique=True,
        blank=True,
        null=True,
    )
    bank = models.CharField(choices=BANKS, blank=True, null=True, max_length=255)

    quests_for_videos = models.ManyToManyField(
        Quest, blank=True, verbose_name=_("Квесты")
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class STQuest(models.Model):
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    quest = models.ForeignKey(Quest, on_delete=models.DO_NOTHING, blank=True, null=True)
    quest_cost = models.IntegerField()
    add_players = models.IntegerField(default=0)
    actor_or_second_actor_or_animator = models.IntegerField(default=0)
    discount_sum = models.IntegerField(default=0)
    discount_desc = models.CharField(default="", max_length=255)
    room_sum = models.IntegerField(default=0)
    room_sum_after = models.IntegerField(default=0)
    room_sum_total = models.IntegerField(default=0)
    room_quantity = models.IntegerField(default=0)
    room_employee_name = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="room_employee_stquest",
    )
    video = models.IntegerField(default=0)
    video_after = models.IntegerField(default=0)
    video_total = models.IntegerField(default=0)
    photomagnets_quantity = models.IntegerField(default=0)
    photomagnets_quantity_after = models.IntegerField(default=0)
    photomagnets_quantity_total = models.IntegerField(default=0)
    photomagnets_sum = models.IntegerField(default=0)
    birthday_congr = models.IntegerField(default=0)
    easy_work = models.IntegerField(default=0)
    night_game = models.IntegerField(default=0)
    administrator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="administrator_stquest",
    )
    administrators_half = models.ManyToManyField(
        User, blank=True, related_name="administrators_half_stquest"
    )
    actors = models.ManyToManyField(User, blank=True, related_name="actors_stquest")
    actors_half = models.ManyToManyField(
        User, blank=True, related_name="actors_half_stquest"
    )
    animator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="animatator_stquest",
    )
    is_package = models.BooleanField(default=False)
    is_video_review = models.BooleanField(default=False)
    video_as_a_gift = models.BooleanField(default=False)

    cash_payment = models.IntegerField(default=0)
    cashless_payment = models.IntegerField(default=0)
    cash_delivery = models.IntegerField(default=0)
    cashless_delivery = models.IntegerField(default=0)
    cash_payment_after = models.IntegerField(default=0)
    cashless_payment_after = models.IntegerField(default=0)
    cash_delivery_after = models.IntegerField(default=0)
    cashless_delivery_after = models.IntegerField(default=0)
    cash_payment_total = models.IntegerField(default=0)
    cashless_payment_total = models.IntegerField(default=0)
    cash_delivery_total = models.IntegerField(default=0)
    cashless_delivery_total = models.IntegerField(default=0)
    prepayment = models.IntegerField(default=0)

    employees_first_time = models.ManyToManyField(
        User, blank=True, related_name="employees_first_time_stquest"
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="created_by",
    )

    client_name = models.CharField(max_length=255, default="")

    def save(self, *args, **kwargs):
        self.room_sum_total = int(self.room_sum) + int(self.room_sum_after)
        self.video_total = int(self.video) + int(self.video_after)
        self.photomagnets_quantity_total = int(self.photomagnets_quantity) + int(
            self.photomagnets_quantity_after
        )
        self.cash_payment_total = int(self.cash_payment) + int(self.cash_payment_after)
        self.cashless_payment_total = int(self.cashless_payment) + int(
            self.cashless_payment_after
        )
        self.cash_delivery_total = int(self.cash_delivery) + int(
            self.cash_delivery_after
        )
        self.cashless_delivery_total = int(self.cashless_delivery) + int(
            self.cashless_delivery_after
        )

        photomagnets_promo = self.photomagnets_quantity // 2
        photomagnets_not_promo = self.photomagnets_quantity - photomagnets_promo
        self.photomagnets_sum = photomagnets_not_promo * 250 + photomagnets_promo * 150
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.quest)


class STQuestHistory(models.Model):
    OPERATION = [
        ("create", "создание"),
        ("edit", "редактирование"),
        ("delete", "удаление"),
    ]
    date_time = models.DateTimeField(default=timezone.now)
    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )
    operation = models.CharField(
        choices=OPERATION, blank=True, null=True, max_length=255
    )

    def __str__(self):
        return str(self.date_time)

class STExpense(models.Model):
    PAID_FROM = [
        ("work_card", "рабочая карта"),
        ("own", "свои"),
        ("cash_register", "касса"),
    ]

    date = models.DateField()

    name = models.CharField(max_length=255, default=0)
    amount = models.IntegerField(default=0)
    description = models.CharField(max_length=255, default=0)

    sub_category = models.ForeignKey(
        STExpenseSubCategory, on_delete=models.SET_NULL, blank=True, null=True
    )
    quests = models.ManyToManyField(Quest, blank=True, related_name="stexpense_quests")

    employees = models.ManyToManyField(User, blank=True, related_name="employees_users")

    paid_from = models.CharField(
        choices=PAID_FROM, blank=True, null=True, max_length=255
    )

    who_paid = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="who_paid_st_expense",
    )
    attachment = models.ImageField(upload_to="photos/", blank=True, null=True)

    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="stexpense_user",
    )
    quest = models.ForeignKey(
        Quest,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="stexpense_quest",
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="stexpense_created_by",
    )

    def __str__(self):
        return str(self.date)

class STExpenseHistory(models.Model):
    OPERATION = [
        ("create", "создание"),
        ("edit", "редактирование"),
        ("delete", "удаление"),
    ]
    date_time = models.DateTimeField(default=timezone.now)
    stexpense = models.ForeignKey(
        STExpense, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    operation = models.CharField(
        choices=OPERATION, blank=True, null=True, max_length=255
    )

    def __str__(self):
        return str(self.date_time)


class STBonusPenalty(models.Model):
    TYPE = [
        ("bonus", "бонус"),
        ("penalty", "штраф"),
    ]

    date = models.DateField(default=timezone.now)

    type = models.CharField(max_length=255, choices=TYPE, default="bonus")

    amount = models.IntegerField(default=0)
    name = models.CharField(max_length=255, default="")

    users = models.ManyToManyField(User, blank=True)

    quests = models.ManyToManyField(Quest, blank=True)

    def __str__(self):
        return str(self.date)


class QIncome(models.Model):
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    game = models.IntegerField(default=0)
    discount_sum = models.IntegerField(default=0)
    discount_desc = models.CharField(default="", max_length=255)
    easy_work = models.IntegerField(default=0)
    night_game = models.IntegerField(default=0)
    room = models.IntegerField(default=0)
    video = models.IntegerField(default=0)
    video_after = models.IntegerField(default=0)
    photomagnets = models.IntegerField(default=0)
    actor = models.IntegerField(default=0)
    total = models.IntegerField(blank=True, null=True)

    paid_cash = models.IntegerField(default=0)
    paid_non_cash = models.IntegerField(default=0)

    quest = models.ForeignKey(Quest, on_delete=models.SET_NULL, blank=True, null=True)

    is_package = models.BooleanField(default=False)

    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )

    def save(self, *args, **kwargs):
        self.total = (
            int(self.game)
            + int(self.room)
            + int(self.video)
            + int(self.video_after)
            + int(self.photomagnets)
            + int(self.actor)
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            str(self.date) + " " + str(self.time) + " " + str(self.stquest.quest.name)
        )


class QSalary(models.Model):
    STATUS = [
        ("correctly", "верно"),
        ("incorrectly", "не верно"),
        ("unknown", "неизвестно"),
    ]

    date = models.DateField()

    amount = models.IntegerField()
    name = models.CharField(max_length=255)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    stquest = models.ForeignKey(
        STQuest,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="qsalary_stquest",
    )
    quest = models.ForeignKey(
        Quest,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="qsalary_quest",
    )

    sub_category = models.CharField(max_length=255, default="")

    status = models.CharField(choices=STATUS, default="unknown", max_length=255)

    st_expense = models.ForeignKey(
        STExpense, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date) + " " + str(self.user) + " " + str(self.stquest)


class QCashRegister(models.Model):
    OPERATION = [
        ("plus", "плюс"),
        ("minus", "минус"),
    ]

    STATUS = [
        ("reset", "обнулено"),
        ("not_reset", "не обнулено"),
    ]

    date = models.DateField()

    amount = models.IntegerField()
    description = models.CharField(max_length=255, blank=True, null=True)

    operation = models.CharField(choices=OPERATION, default="plus", max_length=255)
    status = models.CharField(choices=STATUS, default="not_reset", max_length=255)

    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)
    stexpense = models.ForeignKey(
        STExpense, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date)


class WorkCardExpense(models.Model):
    date = models.DateField()

    amount = models.IntegerField()
    description = models.CharField(max_length=255)

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)
    stexpense = models.ForeignKey(
        STExpense, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date)


class ExpenseFromTheir(models.Model):
    STATUS = [
        ("paid", "выплачено"),
        ("not_paid", "не выплачено"),
    ]

    BANKS = [
        ("sberbank", "сбербанк"),
        ("tinkoff", "тинькофф"),
        ("alfabank", "альфа-банк"),
        ("vtb", "втб"),
    ]

    date = models.DateField()

    amount = models.IntegerField()
    description = models.CharField(max_length=255)

    who_paid = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    status = models.CharField(choices=STATUS, default="not_paid", max_length=255)

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)
    stexpense = models.ForeignKey(
        STExpense, on_delete=models.CASCADE, blank=True, null=True
    )

    phone_number_for_transfer = models.CharField(
        verbose_name=_("Номер телефона для перевода"),
        max_length=18,
        blank=True,
        null=True,
    )
    bank = models.CharField(choices=BANKS, blank=True, null=True, max_length=255)

    def __str__(self):
        return str(self.date)


class QVideo(models.Model):
    TYPE = [
        ("package", "пакет"),
        ("video_review", "видео отзыв"),
    ]

    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)

    client_name = models.CharField(max_length=255)
    sent = models.BooleanField()

    # is_package = models.BooleanField(default=False)
    type = models.CharField(choices=TYPE, default="package", max_length=255)

    note = models.CharField(max_length=255, default="")

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)
    stquest = models.ForeignKey(
        STQuest, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return str(self.date)
