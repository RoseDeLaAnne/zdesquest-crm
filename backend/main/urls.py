from django.urls import path

from . import views


urlpatterns = [
    # GET
    path("users/", views.VUsers),
    path("users/<str:rname>/", views.VUsersByRole),
    path("roles/", views.VRoles),
    path("quests/", views.VQuests),
    path("transactions/", views.VTransactions),
    path("stquests/", views.VSTQuests),
    path("expenses/", views.VExpenses),
    path("bonuses-penalties/", views.VBonusesPenalties),
    path("expense-categories/", views.VExpenseCategories),
    path("expense-sub-categories/", views.VExpenseSubCategories),
    # GET, PUT, DELETE
    path("user/<int:uid>/", views.VUser),
    path("role/<int:rid>/", views.VRole),
    path("quest/<str:qname>/", views.VQuest),
    path("quest/<str:qname>/incomes/", views.VQuestIncomes),
    path("quest/<str:qname>/expenses/", views.VQuestExpenses),
    path("quest/<str:qname>/salaries/", views.VQuestSalaries),
    path("transaction/<int:tid>/", views.VTransaction),
    path("stquest/<int:stqid>/", views.VSTQuest),
    path("expense/<int:eid>/", views.VExpense),
    path("bonus-penalty/<int:bpid>/", views.VBonusPenalty),
    # POST
    path("create/user/", views.VCreateUser),
    path("create/role/", views.VCreateRole),
    path("create/quest/", views.VCreateQuest),
    path("create/transaction/", views.VCreateTransaction),
    path("create/stexpense/", views.VCreateExpense),
    path("create/stquest/", views.VCreateSTQuest),
    path("create/stbonus-penalty/", views.VCreateBonusPenalty),
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
]
