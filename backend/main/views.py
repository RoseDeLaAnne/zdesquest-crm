from django.db.models import Q
from django.db.models import Count

from datetime import datetime
from django.utils.timezone import make_aware
from datetime import timedelta

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import *
from .models import *


@api_view(['GET'])
def GetUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def GetAnimators(request):
    role = Roles.objects.get(role_name="Аниматор")

    users = User.objects.annotate(admin_role_count=Count('roles', filter=models.Q(roles=role))).filter(admin_role_count__gt=0)
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def GetActors(request):
    role = Roles.objects.get(role_name="Актер")

    users = User.objects.annotate(admin_role_count=Count('roles', filter=models.Q(roles=role))).filter(admin_role_count__gt=0)
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def GetAdministrators(request):
    role = Roles.objects.get(role_name="Администратор")

    users = User.objects.annotate(admin_role_count=Count('roles', filter=models.Q(roles=role))).filter(admin_role_count__gt=0)
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def GetQuests(request):
    quests = Quest.objects.all()
    serializer = QuestSerializer(quests, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def GetSalaries(request):
    salaries = Salary.objects.all()
    
    salary_dict = {}  # To track incomes by date

    for salary in salaries:
        if salary.date not in salary_dict:
            salary_dict[salary.date] = {'id': salary.id, 'key': salary.id, 'dateTime': salary.date, 'value': 0, 'user': {
                'id': salary.user.id,
                'firstName': salary.user.first_name
            }, 'children': []}

        salary_dict[salary.date]['value'] += salary.value  # Update sums

        salary_dict[salary.date]['children'].append({'id': salary.id, 'key': salary.id, 'object': salary.object, 'value': salary.value})

    response_data = list(salary_dict.values())
    
    return Response(response_data)

@api_view(['GET'])
def GetExpensesByQuestId(request, qid):
    quest = Quest.objects.get(id=qid)
    expenses = Expenses.objects.filter(quests=quest)
    serializer = ExpensesSerializer(expenses, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def GetIncomesByQuestId(request, qid):
    quest = Quest.objects.get(id = qid)

    incomes = Income.objects.filter(quest=quest)
    income_dict = {}  # To track incomes by date

    for income in incomes:
        if income.date not in income_dict:
            income_dict[income.date] = {'id': income.id, 'key': income.date.strftime('%Y%m%d'), 'dateTime': income.date, 'game': 0,  
                    'room': 0,
                    'video': 0,
                    'photomagnets': 0,
                    'actor': 0,
                    'total': 0, 'children': []}

        child_id = f"{income.date.strftime('%Y%m%d')}{income.time.strftime('%H%M%S')}"

        income_dict[income.date]['game'] += income.game  # Update sums
        income_dict[income.date]['room'] += income.room
        income_dict[income.date]['video'] += income.video
        income_dict[income.date]['photomagnets'] += income.photomagnets
        income_dict[income.date]['actor'] += income.actor
        income_dict[income.date]['total'] += (
            income.game + income.room + income.video + income.photomagnets + income.actor
        )

        income_dict[income.date]['children'].append({'id': income.id, 'key': child_id, 'dateTime': income.time, 'game': income.game, 'room': income.room, 'video': income.video, 'photomagnets': income.photomagnets, 'actor': income.actor, 'total': income.total, 'quest': {
                    'id': income.quest.id,
                    'quest_name': income.quest.quest_name,
                    'quest_address': income.quest.quest_address,
                    'quest_rate': income.quest.quest_rate
                }})

    response_data = list(income_dict.values())
    
    return Response(response_data)

@api_view(['POST'])
def SetQuestForm(request):
    # print(request.data)

    quest = Quest.objects.get(id=request.data['quest'])
    administrator = User.objects.get(id=request.data['administrator'])
    actors = User.objects.filter(id__in=request.data['actor'])
    animator = User.objects.get(id=request.data['animator'])


    input_date_str = request.data['date']
    input_date = datetime.strptime(input_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
    aware_input_date = make_aware(input_date)
    date_only_str = aware_input_date.strftime('%Y-%m-%d')

    input_time_str = request.data['time']
    input_time = datetime.strptime(input_time_str, '%Y-%m-%dT%H:%M:%S.%fZ')
    aware_input_time = make_aware(input_time)
    new_datetime = aware_input_time + timedelta(hours=3)
    time_only_str = new_datetime.strftime('%H:%M:%S.%f')[:-7]

    print(time_only_str)

    new_entry = QuestForm.objects.create(quest=quest, date=date_only_str, time=time_only_str, quest_cost=request.data['questCost'], package=request.data['package'], add_players=request.data['addPlayers'], actor_second_actor=request.data['actorSecondActor'], discount_sum=request.data['discount'], discount_desc=request.data['discountDescription'], room_sum=request.data['roomSum'], room_quantity=request.data['roomQuantity'], room_name=request.data['roomName'], video=request.data['video'], photomagnets_not_promo_sum=request.data['photomagnetsNotPromoSum'], photomagnets_not_promo_quantity=request.data['photomagnetsNotPromoQuantity'], photomagnets_promo_sum=request.data['photomagnetsPromoSum'], photomagnets_promo_quantity=request.data['photomagnetsPromoQuantity'], birthday_congr=request.data['birthdayCongratulations'], easy_work=request.data['easyWork'], night_game=request.data['nightGame'], travel=request.data['travel'], administrator=administrator, animator=animator)
    new_entry.actor.set(actors)    

    # incomes (доходы)
    income_game = int(request.data['questCost']) + int(request.data['addPlayers']) + int(request.data['easyWork']) + int(request.data['nightGame']) - int(request.data['discount'])
    income_room = int(request.data['roomSum'])
    income_video = int(request.data['video'])
    income_photomagnets = int(request.data['photomagnetsNotPromoSum']) + int(request.data['photomagnetsPromoSum'])
    income_actor = int(request.data['actorSecondActor'])

    new_entry_income = Income.objects.create(date=date_only_str, time=time_only_str, game=income_game, room=income_room, video=income_video, photomagnets=income_photomagnets, actor=income_actor, quest=quest)

    # salarys for admins (зарплаты для админов)

    # salarys for actors (зарплаты для актеров)
    print(actors)
    for actor in actors:
        Salary.objects.create(date='2023-05-31', key='Игра', value=quest.quest_rate, user=actor)

        if (request.data['video']):
            Salary.objects.create(date='2023-05-31', key='Видео', value=100, user=actor)

    return Response(status=200)

@api_view(['POST'])
def SetExpensesForm(request):
    print(request.data)

    quests = Quest.objects.filter(id__in=request.data['quests'])

    new_entry = ExpensesForm.objects.create(date='2023-05-31', sum=request.data['sum'], name_of_expense=request.data['expenseName'])
    new_entry.quests.set(quests)

    return Response(status=200)

@api_view(['POST'])
def SetBonusesPenaltiesForm(request):
    print(request.data)

    employee = User.objects.get(id=request.data['employe'])
    quests = Quest.objects.filter(id__in=request.data['quests'])

    print(quests)

    new_entry = BonusesPenaltiesForm.objects.create(date='2023-05-31', employee=employee, bonus=request.data['bonus'], penaltie=request.data['penalty'])
    new_entry.quests.set(quests)

    return Response(status=200)
    