# from django.db import models
# from main.models import Quest

# from django.utils import timezone
# from django.utils.translation import gettext_lazy as _

# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# from .managers import UserManager


# class Roles(models.Model):
#     role_name = models.CharField(max_length=255, unique=True)

#     def __str__(self):
#         return self.role_name

# class User(AbstractBaseUser, PermissionsMixin):
#     username = models.CharField(verbose_name=_('Имя пользователя'), max_length=255, unique=True)

#     last_name = models.CharField(verbose_name=_('Фамилия пользователя'), max_length=255, blank=True, null=True)
#     first_name = models.CharField(verbose_name=_('Имя пользователя'), max_length=255, blank=True, null=True)
#     middle_name = models.CharField(verbose_name=_('Отчество пользователя'), max_length=255, blank=True, null=True)

#     is_active = models.BooleanField(verbose_name=_('Активный'), help_text=_('Отметьте, если пользователь должен считаться активным. Уберите эту отметку вместо удаления учётной записи.'), default=True)
#     is_staff = models.BooleanField(verbose_name=_('Статус персонала'), help_text=_('Отметьте, если пользователь может входить в административную часть сайта.'), default=False)
#     is_superuser = models.BooleanField(verbose_name=_('Статус суперпользователя'), help_text=_('Указывает, что пользователь имеет все права без явного их назначения.'), default=False)

#     roles = models.ManyToManyField(Roles, verbose_name=_('Роли пользователя'))

#     quest = models.ForeignKey(Quest, on_delete=models.CASCADE, blank=True, null=True)

#     date_joined = models.DateTimeField(verbose_name=_('Дата регистрации пользователя'), default=timezone.now)

#     USERNAME_FIELD = 'username'
#     REQUIRED_FIELDS = []

#     objects = UserManager()

#     def __str__(self):
#         return self.username
    

