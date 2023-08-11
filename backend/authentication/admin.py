# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from django.contrib.auth.models import Group

# from django.utils.translation import gettext_lazy as _

# from .models import *


# class RolesAdmin(admin.ModelAdmin):
#     search_fields = (
#         'role_name',
#     )

#     ordering = (
#         '-role_name',
#     )

#     list_display = (
#         'role_name',
#     )
    
#     fieldsets = (
#         (None, {
#             'fields': (
#                 'role_name',
#             ),
#         }),
#     )

#     add_fieldsets = (
#         (None, {
#             'fields': (
#                 'role_name',
#             ),
#         }),
#     )

# class UserAdmin(UserAdmin):
#     search_fields = (
#         'username',
#         'last_name',
#         'first_name',
#         'middle_name',
#     )

#     ordering = (
#         '-date_joined',
#     )

#     list_display = (
#         'username',
#         'last_name',
#         'first_name',
#         'middle_name',
#         'is_active',
#         'is_staff',
#         'is_superuser',
#     )

#     list_filter = (
#         'is_active',
#         'is_staff',
#         'is_superuser',
#     )
    
#     fieldsets = (
#         (None, {
#             'fields': (
#                 'password',
#             ),
#         }),
#         (_('Персональная информация'), {
#             'fields': (
#                 'username',
#                 'last_name',
#                 'first_name',
#                 'middle_name',
#             ),
#         }),
#         (_('Права доступа'), {
#             'fields': (
#                 'is_active',
#                 'is_staff',
#                 'is_superuser',
#             ),
#         }),
#         (_('Роли пользователя'), {
#             'fields': (
#                 'roles',
#             ),
#         }),
#         (_('Важные даты'), {
#             'fields': (
#                 'last_login',
#                 'date_joined',
#             ),
#         }),
#     )

#     add_fieldsets = (
#         (None, {
#             'fields': (
#                 'password1',
#                 'password2',
#             ),
#         }),
#         (_('Персональная информация'), {
#             'fields': (
#                 'username',
#                 'last_name',
#                 'first_name',
#                 'middle_name',
#             ),
#         }),
#         (_('Права доступа'), {
#             'fields': (
#                 'is_active',
#                 'is_staff',
#                 'is_superuser',
#             ),
#         }),
#         (_('Роли пользователя'), {
#             'fields': (
#                 'roles',
#             ),
#         }),
#         (_('Важные даты'), {
#             'fields': (
#                 'date_joined',
#             ),
#         }),
#     )

# admin.site.register(Roles, RolesAdmin)
# admin.site.register(User, UserAdmin)

# admin.site.unregister(Group)
