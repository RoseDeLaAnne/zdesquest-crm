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
    path('additional1/', GetAdditional1),    

    path('quest-form/', SetQuestForm),
    path('quest-table/', GetQuestForm),
    path('expenses-form/', SetExpensesForm),
    path('bonuses-penalties-form/', SetBonusesPenaltiesForm),
    path('additional1-form/', SetAdditional1Form),

    path('additional1-update/<int:aid>/', UpdateAdditional1),
]
