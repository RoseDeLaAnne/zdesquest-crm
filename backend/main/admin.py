from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from django.utils.translation import gettext_lazy as _

from .models import *


class UserAdmin(UserAdmin):
    search_fields = (
        'username',
        'last_name',
        'first_name',
    )

    ordering = (
        '-date_joined',
    )

    list_display = (
        'username',
        'last_name',
        'first_name',
        'is_active',
        'is_staff',
        'is_superuser',
    )

    list_filter = (
        'is_active',
        'is_staff',
        'is_superuser',
    )
    
    fieldsets = (
        (None, {
            'fields': (
                'password',
            ),
        }),
        (_('Персональная информация'), {
            'fields': (
                'username',
                'last_name',
                'first_name',
            ),
        }),
        (_('Права доступа'), {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
            ),
        }),
        (_('Важные даты'), {
            'fields': (
                'last_login',
                'date_joined',
            ),
        }),
        (None, {
            'fields': (
                'quest',
            ),
        }),
    )

    add_fieldsets = (
        (None, {
            'fields': (
                'password1',
                'password2',
            ),
        }),
        (_('Персональная информация'), {
            'fields': (
                'username',
                'last_name',
                'first_name',
            ),
        }),
        (_('Права доступа'), {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
            ),
        }),
        (_('Важные даты'), {
            'fields': (
                'date_joined',
            ),
        }),
        (None, {
            'fields': (
                'quest',
            ),
        }),
    )


admin.site.unregister(Group)

admin.site.register(User, UserAdmin)
admin.site.register(Role)

admin.site.register(Quest)
admin.site.register(QIncome)
# admin.site.register(QExpense)
admin.site.register(QSalary)
admin.site.register(STExpenseCategory)
admin.site.register(STExpenseSubCategory)
admin.site.register(STQuest)
admin.site.register(STExpense)
admin.site.register(STBonusPenalty)
# admin.site.register(STBonus)
# admin.site.register(STPenalty)
admin.site.register(QCashRegister)
admin.site.register(WorkCardExpense)
admin.site.register(ExpenseFromTheir)
