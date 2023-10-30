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
    # path("user/<int:id>/", views.UserById),
    path("user/stquests/", views.UserSTQuests),
    path("users/<str:rname>/", views.UsersByRole),
    path("roles/", views.Roles),
    path("quests/", views.Quests),
    path("quests-with-spec-versions/", views.QuestsWithSpecailVersions),
    path("quest-versions/", views.QuestVersions),
    path("stquests/", views.STQuests),
    path("stexpenses/", views.STExpenses),
    path("stbonuses-penalties/", views.STBonusesPenalties),
    path("stexpense-categories/", views.STExpenseCategories),
    path("stexpense-sub-categories/", views.STExpenseSubCategories),
    path("quest/<int:id>/incomes/", views.QuestIncomes),
    path("quest/<int:id>/expenses/", views.QuestExpenses),
    path("quest/<int:id>/cash-register/", views.VQCashRegister),
    path("quest/<int:id>/work-card-expenses/", views.QWorkCardExpenses),
    path("quest/<int:id>/expenses-from-own/", views.QExpensesFromOwn),
    path("quest/<int:id>/videos/", views.QVideos),
    path("toggle/expenses-from-own/<int:id>/", views.ToggleQExpensesFromOwn),
    path("toggle/cash-register/<int:id>/", views.ToggleQCashRegister),
    path("salaries/", views.Salaries),
    path("salaries/current/", views.SalariesCurrent),
    path("quest-profit/<int:id>/", views.QuestProfitById),
    # GET, PUT, DELETE
    path("user/<int:id>/", views.VUser),
    path("role/<int:id>/", views.VRole),
    path("quest/<int:id>/", views.VQuest),
    path("quest-version/<int:id>/", views.VQuestVersion),
    path("stquest/<int:id>/", views.VSTQuest),
    path("stexpense/<int:id>/", views.VSTExpense),
    path("stbonus-penalty/<int:id>/", views.VSTBonusPenalty),
    path("stexpense-category/<int:id>/", views.VSTExpenseCategory),
    path("stexpense-subcategory/<int:id>/", views.VSTExpenseSubCategory),
    # POST
    path("create/user/", views.CreateUser),
    # path("create/role/", views.CreateRole),
    path("create/quest/", views.CreateQuest),
    path("create/quest-version/", views.CreateQuestVersion),
    path("create/stexpense/", views.CreateSTExpense),
    path("create/stquest/", views.CreateSTQuest),
    path("create/stbonus-penalty/", views.CreateSTBonusPenalty),
    path("create/stexpense-category/", views.CreateSTExpenseCategory),
    path("create/stexpense-subcategory/", views.CreateSTExpenseSubCategory),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
