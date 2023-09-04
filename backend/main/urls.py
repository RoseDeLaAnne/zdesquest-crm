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
    path("users/<str:rname>/", views.UsersByRole),
    path("roles/", views.Roles),
    path("quests/", views.Quests),
    # path("transactions/", views.VTransactions),
    path("stquests/", views.STQuests),
    path("stexpenses/", views.STExpenses),
    path("stbonuses/", views.STBonuses),
    path("stpenalties/", views.STPenalties),
    path("stexpense-categories/", views.STExpenseCategories),
    path("stexpense-sub-categories/", views.STExpenseSubCategories),
    path("quest/<str:name>/incomes/", views.QuestIncomes),
    path("quest/<str:name>/expenses/", views.QuestExpenses),
    path("quest/<str:name>/cash-register/", views.VCashRegister),
    path("salaries/", views.Salaries),
    path("work-card-expenses/", views.WorkCardExpenses),
    path("expenses-from-their/", views.ExpensesFromTheir),
    # GET, PUT, DELETE
    path("user/<int:id>/", views.VUser),
    path("role/<int:id>/", views.VRole),
    path("quest/<int:id>/", views.VQuest),
    # path("transaction/<int:id>/", views.VTransaction),
    path("stquest/<int:id>/", views.VSTQuest),
    path("stexpense/<int:id>/", views.VSTExpense),
    path("stbonus/<int:id>/", views.VSTBonus),
    path("stpenalty/<int:id>/", views.VSTPenalty),
    path("stexpense-category/<int:id>/", views.VSTExpenseCategory),
    path("stexpense-subcategory/<int:id>/", views.VSTExpenseSubCategory),
    # POST
    path("create/user/", views.CreateUser),
    path("create/role/", views.CreateRole),
    path("create/quest/", views.CreateQuest),
    # path("create/transaction/", views.VCreateTransaction),
    path("create/stexpense/", views.CreateSTExpense),
    path("create/stquest/", views.CreateSTQuest),
    path("create/stbonus/", views.CreateSTBonus),
    path("create/stpenalty/", views.CreateSTPenalty),
    path("create/stexpense-category/", views.CreateSTExpenseCategory),
    path("create/stexpense-subcategory/", views.CreateSTExpenseSubCategory),
    # path('quests/', GetQuests),
    # path('animators/', GetAnimators),
    # path('actors/', GetActors),
    # path('administrators/', GetAdministrators),
    # path('quests/', GetQuests),
    # path('salaries/', GetSalaries),
    # path('expenses/<int:qid>/', GetExpenseByQuestId),
    # path('incomes/<int:qid>/', GetIncomesByQuestId),
    # path('additional1/', GetAdditional1),
    # path('quest-form/', SetQuestForm),
    # path('quest-table/', GetQuestForm),
    # path('expenses-form/', SetExpense),
    # path('expenses-table/', GetExpense),
    # path('bonuses-penalties-form/', SetBonusesPenaltiesForm),
    # path('additional1-form/', SetAdditional1Form),
    # path('additional1-update/<int:aid>/', UpdateAdditional1),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
