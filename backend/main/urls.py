from django.urls import path

from .views import *


urlpatterns = [
    path('users/', GetUsers),
    path('animators/', GetAnimators),
    path('actors/', GetActors),
    path('administrators/', GetAdministrators),

    path('quests/', GetQuests),
    path('salaries/', GetSalaries),
    path('expenses/<int:qid>/', GetExpensesByQuestId),
    path('incomes/<int:qid>/', GetIncomesByQuestId),    

    path('quest-form/', SetQuestForm),
    path('expenses-form/', SetExpensesForm),
    path('bonuses-penalties-form/', SetBonusesPenaltiesForm),
]
