from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # GET
    path("users/", views.Users),
    path("user/current/", views.UserCurrent),
    path("user/<int:id>/", views.UserById),
    path("users/<str:rname>/", views.UsersByRole),
    # path("roles/", views.Roles),
    path("quests/", views.Quests),
    path("stquests/", views.STQuests),
    path("stexpenses/", views.STExpenses),
    path("stbonuses-penalties/", views.STBonusesPenalties),
    path("stexpense-categories/", views.STExpenseCategories),
    path("stexpense-sub-categories/", views.STExpenseSubCategories),
    path("quest/<str:name>/incomes/", views.QuestIncomes),
    path("quest/<str:name>/expenses/", views.QuestExpenses),
    path("quest/<str:name>/cash-register/", views.VQCashRegister),
    path("quest/<str:name>/work-card-expenses/", views.QWorkCardExpenses),
    path("quest/<str:name>/expenses-from-their/", views.QExpensesFromTheir),
    path("toggle/expenses-from-their/<int:id>/", views.ToggleQExpensesFromTheir),
    path("toggle/cash-register/<int:id>/", views.ToggleQCashRegister),
    path("salaries/", views.Salaries),
    # GET, PUT, DELETE
    path("user/<int:id>/", views.VUser),
    path("role/<int:id>/", views.VRole),
    path("quest/<int:id>/", views.VQuest),
    path("stquest/<int:id>/", views.VSTQuest),
    path("stexpense/<int:id>/", views.VSTExpense),
    path("stbonus-penalty/<int:id>/", views.VSTBonusPenalty),
    path("stexpense-category/<int:id>/", views.VSTExpenseCategory),
    path("stexpense-subcategory/<int:id>/", views.VSTExpenseSubCategory),
    # POST
    path("create/user/", views.CreateUser),
    # path("create/role/", views.CreateRole),
    path("create/quest/", views.CreateQuest),
    path("create/stexpense/", views.CreateSTExpense),
    path("create/stquest/", views.CreateSTQuest),
    path("create/stbonus-penalty/", views.CreateSTBonusPenalty),
    path("create/stexpense-category/", views.CreateSTExpenseCategory),
    path("create/stexpense-subcategory/", views.CreateSTExpenseSubCategory),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
