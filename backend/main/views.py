import json

from django.http import JsonResponse
from django.db.models import Q
from django.db.models import Count

from datetime import datetime
from django.utils.timezone import make_aware
from datetime import timedelta

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser

from .serializers import *
from .models import *

from collections import defaultdict

from django.db.models import Sum

from .utils import (
    create_travel,
    create_qincome,
    create_qcash_register_from_stquest,
    create_qcash_register_from_stexpense,
    convert_with_children,
)

from django.db.models import Count
from django.db.models.functions import TruncDate


# GET
@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def Users(request):
    if request.method == "GET":
        # if request.user.is_superuser:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)
        # else:
        #     return Response(status=401)


@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def UserCurrent(request):
    if request.method == "GET":
        serializer = UserSerializer(request.user, many=False)

        return Response(serializer.data)


# @api_view(["GET"])
# # @permission_classes([IsAuthenticated])
# def UserById(request, id):
#     if request.method == "GET":
#         user = User.objects.get(id=id)
#         serializer = UserSerializer(user, many=False)

#         return Response(serializer.data)


@api_view(["GET"])
def UserSTQuests(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        entries = STQuest.objects.filter(created_by=request.user).order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                entries = entries.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        entry_dict = {}  # To track incomes by date

        for entry in entries:
            date_timestamp = date_to_timestamp(
                entry.date
            )  # Convert date to Unix timestamp
            date_str = entry.date.strftime("%d.%m.%Y")  # Format date as DD.MM.YYYY

            if date_timestamp not in entry_dict:
                entry_dict[date_timestamp] = {
                    "id": date_timestamp,
                    "key": str(date_timestamp),  # Use Unix timestamp as the key
                    "date_time": date_str,
                    "quest": "",
                    "quest_cost": 0,
                    "add_players": 0,
                    "actor_second_actor": 0,
                    "discount_sum": 0,
                    "discount_desc": "",
                    "room_sum": 0,
                    "room_quantity": 0,
                    "room_employee_name": "",
                    "video": 0,
                    "photomagnets_quantity": 0,
                    "photomagnets_sum": 0,
                    "birthday_congr": 0,
                    "easy_work": 0,
                    "night_game": 0,
                    "administrator": "",
                    "actors": "",
                    "actors_half": "",
                    "animator": "",
                    "is_package": False,
                    "is_video_review": False,
                    "cash_payment": 0,
                    "cashless_payment": 0,
                    "cash_delivery": 0,
                    "cashless_delivery": 0,
                    "prepayment": 0,
                    "created_by": "",
                    "children": [],
                }

            child_id = str(entry.id)  # Use entry.id as the child's key
            entry_time = entry.time.strftime("%H:%M")  # Format time as HH:MM

            serialized_actors = []
            for (
                actor
            ) in (
                entry.actors.all()
            ):  # Assuming actors is a related manager (e.g., a ManyToManyField or ForeignKey)
                serialized_actor = {
                    "id": actor.id,
                    "last_name": actor.last_name,
                    "first_name": actor.first_name,
                }

                # Append the serialized actor to the list
                serialized_actors.append(serialized_actor)
            serialized_half_actors = []
            for (
                actor_half
            ) in (
                entry.actors_half.all()
            ):  # Assuming actors is a related manager (e.g., a ManyToManyField or ForeignKey)
                serialized_half_actor = {
                    "id": actor_half.id,
                    "last_name": actor_half.last_name,
                    "first_name": actor_half.first_name,
                }

                # Append the serialized actor to the list
                serialized_half_actors.append(serialized_half_actor)

            entry_dict[date_timestamp]["quest"] = {
                "id": entry.quest.id,
                "name": entry.quest.name,
            }
            entry_dict[date_timestamp]["quest_cost"] += entry.quest_cost
            entry_dict[date_timestamp]["add_players"] += entry.add_players
            entry_dict[date_timestamp]["actor_second_actor"] += entry.actor_second_actor
            entry_dict[date_timestamp]["discount_sum"] += entry.discount_sum
            entry_dict[date_timestamp]["discount_desc"] = entry.discount_desc
            entry_dict[date_timestamp]["room_sum"] += entry.room_sum
            entry_dict[date_timestamp]["room_quantity"] += entry.room_quantity
            entry_dict[date_timestamp]["room_employee_name"] = {
                "id": entry.room_employee_name.id if entry.room_employee_name else None,
                "last_name": entry.room_employee_name.last_name if entry.room_employee_name else None,
                "first_name": entry.room_employee_name.first_name if entry.room_employee_name else None,
                "middle_name": entry.room_employee_name.middle_name if entry.room_employee_name else None,
            }

            entry_dict[date_timestamp]["video"] += entry.video
            entry_dict[date_timestamp][
                "photomagnets_quantity"
            ] += entry.photomagnets_quantity
            entry_dict[date_timestamp]["photomagnets_sum"] += entry.photomagnets_sum
            entry_dict[date_timestamp]["birthday_congr"] += entry.birthday_congr
            entry_dict[date_timestamp]["easy_work"] += entry.easy_work
            entry_dict[date_timestamp]["night_game"] += entry.night_game
            entry_dict[date_timestamp]["administrator"] = {
                "id": entry.administrator.id,
                "last_name": entry.administrator.last_name,
                "first_name": entry.administrator.first_name,
                "middle_name": entry.created_by.middle_name,
            }
            entry_dict[date_timestamp]["actors"] = serialized_actors
            entry_dict[date_timestamp]["actors_half"] = serialized_half_actors
            entry_dict[date_timestamp]["animator"] = {
                "id": entry.animator.id if entry.animator else None,
                "last_name": entry.animator.last_name if entry.animator else None,
                "first_name": entry.animator.first_name if entry.animator else None,
                "middle_name": entry.animator.middle_name if entry.animator else None,
            }
            entry_dict[date_timestamp]["is_package"] = entry.is_package
            entry_dict[date_timestamp]["is_video_review"] = entry.is_video_review
            entry_dict[date_timestamp]["cash_payment"] += entry.cash_payment
            entry_dict[date_timestamp]["cashless_payment"] += entry.cashless_payment
            entry_dict[date_timestamp]["cash_delivery"] += entry.cash_delivery
            entry_dict[date_timestamp]["cashless_delivery"] += entry.cashless_delivery
            entry_dict[date_timestamp]["prepayment"] += entry.prepayment
            entry_dict[date_timestamp]["created_by"] = {
                "id": entry.created_by.id,
                "last_name": entry.created_by.last_name,
                "first_name": entry.created_by.first_name,
                "middle_name": entry.created_by.middle_name,
            }

            entry_dict[date_timestamp]["children"].append(
                {
                    "id": entry.id,
                    "key": child_id,
                    "date_time": entry_time,  # Use formatted time
                    "quest": {
                        "id": entry.quest.id,
                        "name": entry.quest.name,
                    },
                    "quest_cost": entry.quest_cost,
                    "add_players": entry.add_players,
                    "actor_second_actor": entry.actor_second_actor,
                    "discount_sum": entry.discount_sum,
                    "discount_desc": entry.discount_desc,
                    "room_sum": entry.room_sum,
                    "room_quantity": entry.room_quantity,
                    "room_employee_name": {
                        "id": entry.room_employee_name.id if entry.room_employee_name else None,
                        "last_name": entry.room_employee_name.last_name if entry.room_employee_name else None,
                        "first_name": entry.room_employee_name.first_name if entry.room_employee_name else None,
                        "middle_name": entry.room_employee_name.middle_name if entry.room_employee_name else None,
                    },
                    "video": entry.video,
                    "photomagnets_quantity": entry.photomagnets_quantity,
                    "photomagnets_sum": entry.photomagnets_sum,
                    "birthday_congr": entry.birthday_congr,
                    "easy_work": entry.easy_work,
                    "night_game": entry.night_game,
                    "administrator": {
                        "id": entry.administrator.id,
                        "last_name": entry.administrator.last_name,
                        "first_name": entry.administrator.first_name,
                        "middle_name": entry.administrator.middle_name,
                    },
                    "actors": serialized_actors,
                    "actors_half": serialized_half_actors,
                    "animator": {
                        "id": entry.animator.id if entry.animator else None,
                        "last_name": entry.animator.last_name if entry.animator else None,
                        "first_name": entry.animator.first_name if entry.animator else None,
                        "middle_name": entry.animator.middle_name if entry.animator else None,
                    },
                    "is_package": entry.is_package,
                    "is_video_review": entry.is_video_review,
                    "cash_payment": entry.cash_payment,
                    "cashless_payment": entry.cashless_payment,
                    "cash_delivery": entry.cash_delivery,
                    "cashless_delivery": entry.cashless_delivery,
                    "prepayment": entry.prepayment,
                    "created_by": {
                        "id": entry.created_by.id,
                        "last_name": entry.created_by.last_name,
                        "first_name": entry.created_by.first_name,
                        "middle_name": entry.created_by.middle_name,
                    },
                }
            )

        # Sort children by "date_time" within each parent object
        for date_data in entry_dict.values():
            date_data["children"].sort(key=lambda x: x["date_time"])

        # Convert the dictionary to a list
        response_data = list(entry_dict.values())

        return Response(response_data)


@api_view(["GET"])
def UsersByRole(request, rname):
    if request.method == "GET":
        role = Role.objects.get(latin_name=rname)
        users = User.objects.filter(roles=role)
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def Roles(request):
    if request.method == "GET":
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def Quests(request):
    if request.method == "GET":
        quests = Quest.objects.all()
        serializer = QuestSerializer(quests, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def QuestVersions(request):
    if request.method == "GET":
        quest_versions = QuestVersion.objects.all()
        serializer = QuestVersionSerializer(quest_versions, many=True)

        return Response(serializer.data)


# @api_view(["GET"])
# def VTransactions(request):
#     if request.method == "GET":
#         start_date_param = request.query_params.get("start_date", None)
#         end_date_param = request.query_params.get("end_date", None)

#         transactions = Transaction.objects.all().order_by("date")

#         if start_date_param and end_date_param:
#             try:
#                 start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
#                 end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

#                 transactions = transactions.filter(date__range=(start_date, end_date))
#             except ValueError:
#                 return Response(
#                     {
#                         "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
#                     },
#                     status=400,
#                 )

#         serializer = TransactionSerializer(transactions, many=True)

#         return Response(serializer.data)


@api_view(["GET"])
def STQuests(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        entries = STQuest.objects.all().order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                entries = entries.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        entry_dict = {}  # To track incomes by date

        for entry in entries:
            date_timestamp = date_to_timestamp(
                entry.date
            )  # Convert date to Unix timestamp
            date_str = entry.date.strftime("%d.%m.%Y")  # Format date as DD.MM.YYYY

            if date_timestamp not in entry_dict:
                entry_dict[date_timestamp] = {
                    "id": date_timestamp,
                    "key": str(date_timestamp),  # Use Unix timestamp as the key
                    "date_time": date_str,
                    "quest": "",
                    "quest_cost": 0,
                    "add_players": 0,
                    "actor_second_actor": 0,
                    "discount_sum": 0,
                    "discount_desc": "",
                    "room_sum": 0,
                    "room_quantity": 0,
                    "room_employee_name": "",
                    "video": 0,
                    "photomagnets_quantity": 0,
                    "photomagnets_sum": 0,
                    "birthday_congr": 0,
                    "easy_work": 0,
                    "night_game": 0,
                    "administrator": "",
                    "actors": "",
                    "actors_half": "",
                    "animator": "",
                    "is_package": False,
                    "is_video_review": False,
                    "cash_payment": 0,
                    "cashless_payment": 0,
                    "cash_delivery": 0,
                    "cashless_delivery": 0,
                    "prepayment": 0,
                    "created_by": "",
                    "children": [],
                }

            child_id = str(entry.id)  # Use entry.id as the child's key
            entry_time = entry.time.strftime("%H:%M")  # Format time as HH:MM

            serialized_actors = []
            for (
                actor
            ) in (
                entry.actors.all()
            ):  # Assuming actors is a related manager (e.g., a ManyToManyField or ForeignKey)
                serialized_actor = {
                    "id": actor.id,
                    "last_name": actor.last_name,
                    "first_name": actor.first_name,
                }

                # Append the serialized actor to the list
                serialized_actors.append(serialized_actor)
            serialized_half_actors = []
            for (
                actor_half
            ) in (
                entry.actors_half.all()
            ):  # Assuming actors is a related manager (e.g., a ManyToManyField or ForeignKey)
                serialized_half_actor = {
                    "id": actor_half.id,
                    "last_name": actor_half.last_name,
                    "first_name": actor_half.first_name,
                }

                # Append the serialized actor to the list
                serialized_half_actors.append(serialized_half_actor)

            entry_dict[date_timestamp]["quest"] = {
                "id": entry.quest.id,
                "name": entry.quest.name,
            }
            entry_dict[date_timestamp]["quest_cost"] += entry.quest_cost
            entry_dict[date_timestamp]["add_players"] += entry.add_players
            entry_dict[date_timestamp]["actor_second_actor"] += entry.actor_second_actor
            entry_dict[date_timestamp]["discount_sum"] += entry.discount_sum
            entry_dict[date_timestamp]["discount_desc"] = entry.discount_desc
            entry_dict[date_timestamp]["room_sum"] += entry.room_sum
            entry_dict[date_timestamp]["room_quantity"] += entry.room_quantity
            entry_dict[date_timestamp]["room_employee_name"] = {
                "id": entry.room_employee_name.id if entry.room_employee_name else None,
                "last_name": entry.room_employee_name.last_name if entry.room_employee_name else None,
                "first_name": entry.room_employee_name.first_name if entry.room_employee_name else None,
                "middle_name": entry.room_employee_name.middle_name if entry.room_employee_name else None,
            }

            entry_dict[date_timestamp]["video"] += entry.video
            entry_dict[date_timestamp][
                "photomagnets_quantity"
            ] += entry.photomagnets_quantity
            entry_dict[date_timestamp]["photomagnets_sum"] += entry.photomagnets_sum
            entry_dict[date_timestamp]["birthday_congr"] += entry.birthday_congr
            entry_dict[date_timestamp]["easy_work"] += entry.easy_work
            entry_dict[date_timestamp]["night_game"] += entry.night_game
            entry_dict[date_timestamp]["administrator"] = {
                "id": entry.administrator.id,
                "last_name": entry.administrator.last_name,
                "first_name": entry.administrator.first_name,
                "middle_name": entry.created_by.middle_name,
            }
            entry_dict[date_timestamp]["actors"] = serialized_actors
            entry_dict[date_timestamp]["actors_half"] = serialized_half_actors
            entry_dict[date_timestamp]["animator"] = {
                "id": entry.animator.id if entry.animator else None,
                "last_name": entry.animator.last_name if entry.animator else None,
                "first_name": entry.animator.first_name if entry.animator else None,
                "middle_name": entry.animator.middle_name if entry.animator else None,
            }
            entry_dict[date_timestamp]["is_package"] = entry.is_package
            entry_dict[date_timestamp]["is_video_review"] = entry.is_video_review
            entry_dict[date_timestamp]["cash_payment"] += entry.cash_payment
            entry_dict[date_timestamp]["cashless_payment"] += entry.cashless_payment
            entry_dict[date_timestamp]["cash_delivery"] += entry.cash_delivery
            entry_dict[date_timestamp]["cashless_delivery"] += entry.cashless_delivery
            entry_dict[date_timestamp]["prepayment"] += entry.prepayment
            entry_dict[date_timestamp]["created_by"] = {
                "id": entry.created_by.id,
                "last_name": entry.created_by.last_name,
                "first_name": entry.created_by.first_name,
                "middle_name": entry.created_by.middle_name,
            }

            entry_dict[date_timestamp]["children"].append(
                {
                    "id": entry.id,
                    "key": child_id,
                    "date_time": entry_time,  # Use formatted time
                    "quest": {
                        "id": entry.quest.id,
                        "name": entry.quest.name,
                    },
                    "quest_cost": entry.quest_cost,
                    "add_players": entry.add_players,
                    "actor_second_actor": entry.actor_second_actor,
                    "discount_sum": entry.discount_sum,
                    "discount_desc": entry.discount_desc,
                    "room_sum": entry.room_sum,
                    "room_quantity": entry.room_quantity,
                    "room_employee_name": {
                        "id": entry.room_employee_name.id if entry.room_employee_name else None,
                        "last_name": entry.room_employee_name.last_name if entry.room_employee_name else None,
                        "first_name": entry.room_employee_name.first_name if entry.room_employee_name else None,
                        "middle_name": entry.room_employee_name.middle_name if entry.room_employee_name else None,
                    },
                    "video": entry.video,
                    "photomagnets_quantity": entry.photomagnets_quantity,
                    "photomagnets_sum": entry.photomagnets_sum,
                    "birthday_congr": entry.birthday_congr,
                    "easy_work": entry.easy_work,
                    "night_game": entry.night_game,
                    "administrator": {
                        "id": entry.administrator.id,
                        "last_name": entry.administrator.last_name,
                        "first_name": entry.administrator.first_name,
                        "middle_name": entry.administrator.middle_name,
                    },
                    "actors": serialized_actors,
                    "actors_half": serialized_half_actors,
                    "animator": {
                        "id": entry.animator.id if entry.animator else None,
                        "last_name": entry.animator.last_name if entry.animator else None,
                        "first_name": entry.animator.first_name if entry.animator else None,
                        "middle_name": entry.animator.middle_name if entry.animator else None,
                    },
                    "is_package": entry.is_package,
                    "is_video_review": entry.is_video_review,
                    "cash_payment": entry.cash_payment,
                    "cashless_payment": entry.cashless_payment,
                    "cash_delivery": entry.cash_delivery,
                    "cashless_delivery": entry.cashless_delivery,
                    "prepayment": entry.prepayment,
                    "created_by": {
                        "id": entry.created_by.id,
                        "last_name": entry.created_by.last_name,
                        "first_name": entry.created_by.first_name,
                        "middle_name": entry.created_by.middle_name,
                    },
                }
            )

        # Sort children by "date_time" within each parent object
        for date_data in entry_dict.values():
            date_data["children"].sort(key=lambda x: x["date_time"])

        # Convert the dictionary to a list
        response_data = list(entry_dict.values())

        return Response(response_data)


@api_view(["GET"])
def STExpenses(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        expenses = STExpense.objects.all().order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                expenses = expenses.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        serializer = STExpenseSerializer(expenses, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def STBonusesPenalties(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        entries = STBonusPenalty.objects.all().order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                entries = entries.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        serializer = STBonusPenaltySerializer(entries, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def STExpenseCategories(request):
    if request.method == "GET":
        categories = STExpenseCategory.objects.all()
        serializer = STExpenseCategorySerializer(categories, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def STExpenseSubCategories(request):
    if request.method == "GET":
        sub_categories = STExpenseSubCategory.objects.all()
        serializer = STExpenseSubCategorySerializer(sub_categories, many=True)

        return Response(serializer.data)


# GET, PUT, DELETE
@api_view(["GET", "PUT", "DELETE"])
def VUser(request, id):
    if request.method == "GET":
        user = User.objects.get(id=id)
        serializer = UserSerializer(user, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        # try:
        data = json.loads(request.body)

        print('asd')

        quest = Quest.objects.get(id=data["quest"])
        roles = Role.objects.filter(id__in=data["roles"])

        formatted_date = datetime.strptime(data['date_of_birth'], '%Y-%m-%dT%H:%M:%S.%fZ').date()

        user = User.objects.get(id=id)
        user.username = data["username"]
        user.last_name = data["last_name"]
        user.first_name = data["first_name"]
        if "middle_name" in data:
            user.middle_name = data["middle_name"]
        if "date_of_birth" in data:
            user.date_of_birth = formatted_date
        if "email" in data:
            user.email = data["email"]
        if "phone_number" in data:
            user.phone_number = data["phone_number"]
        if "quest" in data:
            user.quest = quest

        if "password" in data:
            user.set_password(data["password"])

        user.save()
        user.roles.set(roles)

        return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        user = User.objects.get(id=id)
        user.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VRole(request, id):
    if request.method == "GET":
        role = Role.objects.get(id=id)
        serializer = RoleSerializer(role, many=False)

        return Response(serializer.data)

    # if request.method == "PUT":
    #     try:
    #         data = json.loads(request.body)

    #         formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
    #         sub_category = ExpenseSubCategory.objects.get(id=data["subCategory"])
    #         quests = Quest.objects.filter(id__in=data["quests"])

    #         expense = Expense.objects.get(id=id)
    #         expense.date = formatted_date
    #         expense.amount = data["amount"]
    #         expense.name = data["name"]
    #         expense.sub_category = sub_category
    #         expense.save()
    #         expense.quests.set(quests)

    #         return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

    #     except Exception as e:
    #         return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        role = Role.objects.get(id=id)
        role.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VQuest(request, id):
    if request.method == "GET":
        entry = Quest.objects.get(id=id)
        serializer = QuestSerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        # try:
        data1 = json.loads(request.body)
        data = {key: value for key, value in data1.items() if value not in ("", None)}

        entry = Quest.objects.get(id=id)
        entry.name = data["name"]
        entry.address = data["address"]
        entry.cost_weekdays = data["cost_weekdays"]
        entry.cost_weekends = data["cost_weekends"]
        entry.administrator_rate = data["administrator_rate"]
        entry.actor_rate = data["actor_rate"]
        entry.duration_minute = data["duration_minute"]
        if "special_versions" in data:
            special_versions = Quest.objects.filter(id__in=data["special_versions"])
            entry.special_versions.set(special_versions)
        if "versions" in data:
            versions = QuestVersion.objects.filter(id__in=data["versions"])
            entry.versions.set(versions)
        entry.save()

        return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = Quest.objects.get(id=id)
        entry.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VQuestVersion(request, id):
    if request.method == "GET":
        entry = QuestVersion.objects.get(id=id)
        serializer = QuestVersionSerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            entry = QuestVersion.objects.get(id=id)
            entry.name = data["name"]
            entry.save()

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = QuestVersion.objects.get(id=id)
        entry.delete()

        return Response(status=200)


from datetime import datetime


def date_to_timestamp(date):
    return int(datetime(date.year, date.month, date.day).timestamp())


@api_view(["GET"])
def QuestIncomes(request, id):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        quest = Quest.objects.get(id=id)
        incomes = QIncome.objects.filter(quest=quest).order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                incomes = incomes.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        income_dict = {}  # To track incomes by date

        for income in incomes:
            date_timestamp = date_to_timestamp(
                income.date
            )  # Convert date to Unix timestamp
            date_str = income.date.strftime("%d.%m.%Y")  # Format date as DD.MM.YYYY

            if date_timestamp not in income_dict:
                income_dict[date_timestamp] = {
                    "id": date_timestamp,
                    "key": str(date_timestamp),  # Use Unix timestamp as the key
                    "date_time": date_str,
                    "game": 0,
                    "room": 0,
                    "video": 0,
                    "photomagnets": 0,
                    "actor": 0,
                    "total": 0,
                    "paid_cash": 0,
                    "paid_non_cash": 0,
                    "children": [],
                }

            child_id = str(income.id)  # Use income.id as the child's key
            income_time = income.time.strftime("%H:%M")  # Format time as HH:MM

            income_dict[date_timestamp]["game"] += income.game  # Update sums
            income_dict[date_timestamp]["room"] += income.room
            income_dict[date_timestamp]["video"] += income.video
            income_dict[date_timestamp]["photomagnets"] += income.photomagnets
            income_dict[date_timestamp]["actor"] += income.actor
            income_dict[date_timestamp]["total"] += (
                income.game
                + income.room
                + income.video
                + income.photomagnets
                + income.actor
            )
            income_dict[date_timestamp]["paid_cash"] += income.paid_cash
            income_dict[date_timestamp]["paid_non_cash"] += income.paid_non_cash

            income_dict[date_timestamp]["children"].append(
                {
                    "id": income.id,
                    "key": child_id,
                    "date_time": income_time,  # Use formatted time
                    "game": income.game,
                    "room": income.room,
                    "video": income.video,
                    "photomagnets": income.photomagnets,
                    "actor": income.actor,
                    "total": income.total,
                    "quest": income.quest.id,
                    "paid_cash": income.paid_cash,
                    "paid_non_cash": income.paid_non_cash,
                }
            )

        # Sort children by "date_time" within each parent object
        for date_data in income_dict.values():
            date_data["children"].sort(key=lambda x: x["date_time"])

        # Convert the dictionary to a list
        response_data = list(income_dict.values())

        return Response(response_data)


@api_view(["GET"])
def QuestExpenses(request, id):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        try:
            start_date = (
                datetime.strptime(start_date_param, "%d-%m-%Y").date()
                if start_date_param
                else None
            )
            end_date = (
                datetime.strptime(end_date_param, "%d-%m-%Y").date()
                if end_date_param
                else None
            )
        except ValueError:
            return JsonResponse(
                {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
            )

        # Get the Quest object
        quest = Quest.objects.get(id=id)

        # Filter expenses based on Quest
        entries = STExpense.objects.filter(quests=quest).order_by("date")

        # Apply date range filter
        if start_date and end_date:
            entries = entries.filter(date__range=(start_date, end_date))

        # Get all sub-categories
        sub_categories = STExpenseSubCategory.objects.all()

        # Prepare sub-category info
        sub_category_info = {
            sub_category.name: {
                "id": sub_category.id,
                "title": sub_category.name,
            }
            for sub_category in sub_categories
        }

        # Initialize aggregated data using defaultdict
        aggregated_data = defaultdict(lambda: defaultdict(int))

        # Populate aggregated_data
        for entry in entries:
            date = entry.date.strftime("%d.%m.%Y")
            sub_category = entry.sub_category.name
            amount = entry.amount
            aggregated_data[date][sub_category] += amount

        # Prepare transformed data
        transformed_data = {"head": [], "body": []}
        category_ids = set()

        # Iterate through sub-categories to create category structure
        for sub_category in sub_categories:
            category_id = sub_category.category.id
            if category_id not in category_ids:
                category_data = {
                    "title": sub_category.category.name,
                    "children": [],
                }
                transformed_data["head"].append(category_data)
                category_ids.add(category_id)

            sub_category_data = {
                "title": sub_category.name,
                "dataIndex": sub_category.name,
                "key": sub_category.name,
            }
            category_data["children"].append(sub_category_data)

        # Populate transformed data
        id_counter = 1
        for date, sub_category_data in aggregated_data.items():
            row = {"date": date, "id": id_counter, "key": str(id_counter)}
            id_counter += 1

            # Initialize all sub-categories to 0 in the row
            for sub_category in sub_categories:
                row[sub_category.name] = 0

            for sub_category, amount in sub_category_data.items():
                row[sub_category] = amount
            row["total"] = sum(sub_category_data.values())
            transformed_data["body"].append(row)

        # Return the transformed data as a response
        return Response(transformed_data)


@api_view(["GET"])
def VQCashRegister(request, id):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        try:
            start_date = (
                datetime.strptime(start_date_param, "%d-%m-%Y").date()
                if start_date_param
                else None
            )
            end_date = (
                datetime.strptime(end_date_param, "%d-%m-%Y").date()
                if end_date_param
                else None
            )
        except ValueError:
            return JsonResponse(
                {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
            )

        quest = Quest.objects.get(id=id)
        cash_register = QCashRegister.objects.filter(quest=quest).order_by("date")

        if start_date and end_date:
            cash_register = cash_register.filter(date__range=(start_date, end_date))

        serializer = QCashRegisterSerializer(cash_register, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def ToggleQCashRegister(request, id):
    if request.method == "GET":
        entry = QCashRegister.objects.get(id=id)

        if entry.status == "not_reset":
            entry.status = "reset"
        else:
            entry.status = "not_reset"

        entry.save()

        return Response(status=200)


@api_view(["GET"])
def Salaries(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        try:
            start_date = (
                datetime.strptime(start_date_param, "%d-%m-%Y").date()
                if start_date_param
                else None
            )
            end_date = (
                datetime.strptime(end_date_param, "%d-%m-%Y").date()
                if end_date_param
                else None
            )
        except ValueError:
            return JsonResponse(
                {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
            )

        salaries = QSalary.objects.select_related("user").order_by("date")

        if start_date and end_date:
            salaries = salaries.filter(date__range=(start_date, end_date))

        users = User.objects.all()
        user_data_map = {user.id: UserSerializer(user).data for user in users}

        head_data = [
            {"title": user.first_name, "dataIndex": user.username, "key": user.username}
            for user in users
        ]

        merged_data = {}
        for salary in salaries:
            date_str = salary.date.strftime("%d.%m.%Y")
            item_name = salary.name

            if date_str not in merged_data:
                merged_data[date_str] = {"id": salary.id, "date": date_str}

            for user in users:
                username = user.username
                if username not in merged_data[date_str]:
                    merged_data[date_str][username] = {
                        "sum": 0,
                        "tooltip": {},
                    }

            if salary.user.username not in merged_data[date_str]:
                merged_data[date_str][salary.user.username] = {
                    "sum": salary.amount,
                    "tooltip": {item_name: {"count": 1, "total_amount": salary.amount}},
                }
            else:
                child = merged_data[date_str][salary.user.username]
                child["sum"] += salary.amount
                if item_name in child["tooltip"]:
                    child["tooltip"][item_name]["count"] += 1
                    child["tooltip"][item_name]["total_amount"] += salary.amount
                else:
                    child["tooltip"][item_name] = {
                        "count": 1,
                        "total_amount": salary.amount,
                    }

        body_data = []
        for date_str, date_data in merged_data.items():
            user_data = {
                "id": date_data["id"],
                "key": str(date_data["id"]),
                "date": date_data["date"],
            }

            for username, data in date_data.items():
                if username not in ("id", "date"):
                    user_data[username] = {
                        "sum": data["sum"],
                        "tooltip": "<br />".join(
                            [
                                f"{item_data['total_amount']}р. - {item_data['count']} {item_name}"
                                for item_name, item_data in data["tooltip"].items()
                            ]
                        ),
                    }

            body_data.append(user_data)

        transformed_data = {"head": head_data, "body": body_data}
        return Response(transformed_data)
    

@api_view(["GET"])
def SalariesCurrent(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        try:
            start_date = (
                datetime.strptime(start_date_param, "%d-%m-%Y").date()
                if start_date_param
                else None
            )
            end_date = (
                datetime.strptime(end_date_param, "%d-%m-%Y").date()
                if end_date_param
                else None
            )
        except ValueError:
            return JsonResponse(
                {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
            )

        salaries = QSalary.objects.select_related("user").order_by("date")

        if start_date and end_date:
            salaries = salaries.filter(date__range=(start_date, end_date))

        users = User.objects.filter(id=request.user.id)
        user_data_map = {user.id: UserSerializer(user).data for user in users}

        head_data = [
            {"title": user.first_name, "dataIndex": user.username, "key": user.username}
            for user in users
        ]

        merged_data = {}
        for salary in salaries:
            date_str = salary.date.strftime("%d.%m.%Y")
            item_name = salary.name

            if date_str not in merged_data:
                merged_data[date_str] = {"id": salary.id, "date": date_str}

            for user in users:
                username = user.username
                if username not in merged_data[date_str]:
                    merged_data[date_str][username] = {
                        "sum": 0,
                        "tooltip": {},
                    }

            if salary.user.username not in merged_data[date_str]:
                merged_data[date_str][salary.user.username] = {
                    "sum": salary.amount,
                    "tooltip": {item_name: {"count": 1, "total_amount": salary.amount}},
                }
            else:
                child = merged_data[date_str][salary.user.username]
                child["sum"] += salary.amount
                if item_name in child["tooltip"]:
                    child["tooltip"][item_name]["count"] += 1
                    child["tooltip"][item_name]["total_amount"] += salary.amount
                else:
                    child["tooltip"][item_name] = {
                        "count": 1,
                        "total_amount": salary.amount,
                    }

        body_data = []
        for date_str, date_data in merged_data.items():
            user_data = {
                "id": date_data["id"],
                "key": str(date_data["id"]),
                "date": date_data["date"],
            }

            for username, data in date_data.items():
                if username not in ("id", "date"):
                    user_data[username] = {
                        "sum": data["sum"],
                        "tooltip": "<br />".join(
                            [
                                f"{item_data['total_amount']}р. - {item_data['count']} {item_name}"
                                for item_name, item_data in data["tooltip"].items()
                            ]
                        ),
                    }

            body_data.append(user_data)

        transformed_data = {"head": head_data, "body": body_data}
        return Response(transformed_data)

@api_view(["GET"])
def QuestProfitById(request, id):
    if request.method == "GET":
        qincomes = QIncome.objects.filter(quest__id=id)

        total = qincomes.aggregate(
            total=Sum('game') + Sum('room') + Sum('video') + Sum('photomagnets')
        )['total'] or 0

        print(total)
        response_data = {'total': total}

        return Response(response_data)


# @api_view(["GET"])
# def WorkCardExpenses(request):
#     if request.method == "GET":
#         start_date_param = request.query_params.get("start_date")
#         end_date_param = request.query_params.get("end_date")

#         try:
#             start_date = (
#                 datetime.strptime(start_date_param, "%d-%m-%Y").date()
#                 if start_date_param
#                 else None
#             )
#             end_date = (
#                 datetime.strptime(end_date_param, "%d-%m-%Y").date()
#                 if end_date_param
#                 else None
#             )
#         except ValueError:
#             return JsonResponse(
#                 {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
#             )

#         work_card_expenses = WorkCardExpense.objects.all().order_by("date")

#         if start_date and end_date:
#             work_card_expenses = work_card_expenses.filter(date__range=(start_date, end_date))

#         serializer = WorkCardExpenseSerializer(work_card_expenses, many=True)

#         return Response(serializer.data)


# @api_view(["GET"])
# def ExpensesFromTheir(request):
#     if request.method == "GET":
#         start_date_param = request.query_params.get("start_date")
#         end_date_param = request.query_params.get("end_date")

#         try:
#             start_date = (
#                 datetime.strptime(start_date_param, "%d-%m-%Y").date()
#                 if start_date_param
#                 else None
#             )
#             end_date = (
#                 datetime.strptime(end_date_param, "%d-%m-%Y").date()
#                 if end_date_param
#                 else None
#             )
#         except ValueError:
#             return JsonResponse(
#                 {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
#             )

#         expenses_from_their = ExpenseFromTheir.objects.all().order_by("date")

#         if start_date and end_date:
#             expenses_from_their = expenses_from_their.filter(date__range=(start_date, end_date))

#         serializer = ExpenseFromTheirSerializer(expenses_from_their, many=True)

#         return Response(serializer.data)


@api_view(["GET"])
def QWorkCardExpenses(request, id):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        quest = Quest.objects.get(id=id)

        try:
            start_date = (
                datetime.strptime(start_date_param, "%d-%m-%Y").date()
                if start_date_param
                else None
            )
            end_date = (
                datetime.strptime(end_date_param, "%d-%m-%Y").date()
                if end_date_param
                else None
            )
        except ValueError:
            return JsonResponse(
                {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
            )

        work_card_expenses = WorkCardExpense.objects.filter(quest=quest).order_by(
            "date"
        )

        if start_date and end_date:
            work_card_expenses = work_card_expenses.filter(
                date__range=(start_date, end_date)
            )

        serializer = WorkCardExpenseSerializer(work_card_expenses, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def QExpensesFromTheir(request, id):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        quest = Quest.objects.get(id=id)

        try:
            start_date = (
                datetime.strptime(start_date_param, "%d-%m-%Y").date()
                if start_date_param
                else None
            )
            end_date = (
                datetime.strptime(end_date_param, "%d-%m-%Y").date()
                if end_date_param
                else None
            )
        except ValueError:
            return JsonResponse(
                {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
            )

        entries = ExpenseFromTheir.objects.filter(quest=quest).order_by("date")

        if start_date and end_date:
            entries = entries.filter(date__range=(start_date, end_date))

        entries_dict = {}  # To track incomes by date

        for entry in entries:
            date_timestamp = date_to_timestamp(
                entry.date
            )  # Convert date to Unix timestamp
            date_str = entry.date.strftime("%d.%m.%Y")  # Format date as DD.MM.YYYY

            if date_timestamp not in entries_dict:
                entries_dict[date_timestamp] = {
                    "id": date_timestamp,
                    "key": str(date_timestamp),  # Use Unix timestamp as the key
                    "date": date_str,
                    "amount": 0,
                    "description": "",
                    "who_paid": "",
                    "status": "",
                    "quest": "",
                    "children": [],
                }

            child_id = str(entry.id)  # Use income.id as the child's key

            entries_dict[date_timestamp]["amount"] += entry.amount
            # entries_dict[date_timestamp]["description"] = entry.description
            # entries_dict[date_timestamp]["who_paid"] = {
            #     "id": entry.who_paid.id,
            #     "last_name": entry.who_paid.last_name,
            #     "first_name": entry.who_paid.first_name,
            # }
            # entries_dict[date_timestamp]["status"] = entry.status
            # entries_dict[date_timestamp]["quest"] = {
            #     "id": entry.quest.id,
            #     "latin_name": entry.quest.latin_name,
            #     "name": entry.quest.name,
            # }

            entries_dict[date_timestamp]["children"].append(
                {
                    "id": entry.id,
                    "key": child_id,
                    "amount": entry.amount,
                    "description": entry.description,
                    "who_paid": {
                        "id": entry.who_paid.id,
                        "last_name": entry.who_paid.last_name,
                        "first_name": entry.who_paid.first_name,
                    },
                    "status": entry.status,
                    "quest": {
                        "id": entry.quest.id,
                        "latin_name": entry.quest.latin_name,
                        "name": entry.quest.name,
                    },
                }
            )

        # Convert the dictionary to a list
        response_data = list(entries_dict.values())

        return Response(response_data)


@api_view(["GET"])
def QVideos(request, id):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        quest = Quest.objects.get(id=id)

        try:
            start_date = (
                datetime.strptime(start_date_param, "%d-%m-%Y").date()
                if start_date_param
                else None
            )
            end_date = (
                datetime.strptime(end_date_param, "%d-%m-%Y").date()
                if end_date_param
                else None
            )
        except ValueError:
            return JsonResponse(
                {"error": "Invalid date format. Please use DD-MM-YYYY."}, status=400
            )

        entries = QVideo.objects.filter(quest=quest).order_by("date")

        if start_date and end_date:
            entries = entries.filter(date__range=(start_date, end_date))

        keys_to_remove = ["id", "quest_id"]
        response_data = convert_with_children(entries, keys_to_remove)

        return Response(response_data)

        # if date_timestamp not in income_dict:
        #     income_dict[date_timestamp] = {
        #         "id": date_timestamp,
        #         "key": str(date_timestamp),  # Use Unix timestamp as the key
        #         "date_time": date_str,
        #         "game": 0,
        #         "room": 0,
        #         "video": 0,
        #         "photomagnets": 0,
        #         "actor": 0,
        #         "total": 0,
        #         "paid_cash": 0,
        #         "paid_non_cash": 0,
        #         "children": [],
        #     }

        # child_id = str(income.id)  # Use income.id as the child's key
        # income_time = income.time.strftime("%H:%M")  # Format time as HH:MM

        # income_dict[date_timestamp]["game"] += income.game  # Update sums
        # income_dict[date_timestamp]["room"] += income.room
        # income_dict[date_timestamp]["video"] += income.video
        # income_dict[date_timestamp]["photomagnets"] += income.photomagnets
        # income_dict[date_timestamp]["actor"] += income.actor
        # income_dict[date_timestamp]["total"] += (
        #     income.game
        #     + income.room
        #     + income.video
        #     + income.photomagnets
        #     + income.actor
        # )
        # income_dict[date_timestamp]["paid_cash"] += income.paid_cash
        # income_dict[date_timestamp]["paid_non_cash"] += income.paid_non_cash

        # income_dict[date_timestamp]["children"].append(
        #     {
        #         "id": income.id,
        #         "key": child_id,
        #         "date_time": income_time,  # Use formatted time
        #         "game": income.game,
        #         "room": income.room,
        #         "video": income.video,
        #         "photomagnets": income.photomagnets,
        #         "actor": income.actor,
        #         "total": income.total,
        #         "quest": income.quest.id,
        #         "paid_cash": income.paid_cash,
        #         "paid_non_cash": income.paid_non_cash,
        #     }
        # )

        # print(entries)

        # serializer = QVideoSerializer(entries, many=True)

        # return Response(serializer.data)
        return Response(status=200)


@api_view(["GET"])
def ToggleQExpensesFromTheir(request, id):
    if request.method == "GET":
        entry = ExpenseFromTheir.objects.get(id=id)
        print(entry)

        if entry.status == "not_paid":
            entry.status = "paid"
        else:
            entry.status = "not_paid"

        entry.save()

        return Response(status=200)


# @api_view(["GET", "PUT", "DELETE"])
# def VTransaction(request, tid):
#     if request.method == "GET":
#         transaction = Transaction.objects.get(id=tid)
#         serializer = TransactionSerializer(transaction, many=False)

#         return Response(serializer.data)

#     if request.method == "PUT":
#         try:
#             data = json.loads(request.body)

#             formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()

#             transaction = Transaction.objects.get(id=tid)
#             transaction.date = formatted_date
#             transaction.amount = data["amount"]
#             transaction.status = data["status"]
#             transaction.save()

#             return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     if request.method == "DELETE":
#         transaction = Transaction.objects.get(id=tid)
#         transaction.delete()

#         return JsonResponse({"message": "Запись успешно удалена"}, status=200)


@api_view(["GET", "PUT", "DELETE"])
def VSTExpense(request, id):
    if request.method == "GET":
        expense = STExpense.objects.get(id=id)
        serializer = STExpenseSerializer(expense, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data1 = json.loads(request.body)
            data = {key: value for key, value in data1.items() if value not in ("", None)}

            formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
            sub_category = STExpenseSubCategory.objects.get(id=data["sub_category"])
            quests = Quest.objects.filter(id__in=data["quests"])
            who_paid = User.objects.get(id=data['who_paid'])

            expense = STExpense.objects.get(id=id)
            expense.date = formatted_date
            expense.amount = data["amount"]
            expense.name = data["name"]
            expense.sub_category = sub_category
            expense.paid_from = data["paid_from"]
            expense.who_paid = who_paid
            expense.save()
            expense.quests.set(quests)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        expense = STExpense.objects.get(id=id)
        expense.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VSTQuest(request, id):
    if request.method == "GET":
        entry = STQuest.objects.get(id=id)
        serializer = STQuestSerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        # try:
        data1 = json.loads(request.body)
        data = {key: value for key, value in data1.items() if value not in ("", None)}

        print(id)
        
        quest = Quest.objects.get(id=data["quest"])
        administrator = User.objects.get(id=data["administrator"])        


        optional_fields = [
            "add_players",
            "actor_second_actor",
            "discount_sum",
            "discount_desc",
            "room_sum",
            "video",
            "birthday_congr",
            "easy_work",
            "night_game",
            "is_package",
            "is_video_review",
            "cash_payment",
            "cashless_payment",
            "cash_delivery",
            "cashless_delivery",
            "prepayment",
            "room_quantity",
        ]

        new_data01 = {}
        new_data02 = {}
        new_data1 = {}
        new_data2 = {}
        new_data3 = {}
        new_data4 = {}

        if "date" in data:
            formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
            new_data01 = {
                "date": formatted_date,
            }

        if "time" in data:
            formatted_time_without_3_hours = datetime.fromisoformat(data['time'].replace('Z', '')).time()
            formatted_time = (
                datetime.combine(datetime.min, formatted_time_without_3_hours)
                + timedelta(hours=3)
            ).time()
            new_data02 = {
                "time": formatted_time,
            }

        entry_data = {
            "quest": quest,
            # "date": formatted_date,
            # "time": formatted_time,
            "quest_cost": data["quest_cost"],
            "administrator": administrator,
        }

        if "animator" in data:
            animator = User.objects.get(id=data["animator"])
            new_data1 = {
                "animator": animator,
            }
        else:
            new_data1 = {
                "animator": None,
            }
        if "room_employee_name" in data:
            room_employee_name = User.objects.get(id=data["room_employee_name"])
            new_data2 = {
                "room_employee_name": room_employee_name,
            }
        else:
            new_data2 = {
                "room_employee_name": None,
            }
        if "photomagnets_quantity" in data:
            new_data3 = {"photomagnets_quantity": int(data["photomagnets_quantity"])}
        else:
            new_data3 = {"photomagnets_quantity": 0}
            new_data4 = {"photomagnets_sum": 0}
        
        entry_data.update(new_data01)
        entry_data.update(new_data02)
        entry_data.update(new_data1)
        entry_data.update(new_data2)
        entry_data.update(new_data3)
        entry_data.update(new_data4)

        for field in optional_fields:
            if field in data:
                entry_data[field] = data[field]
            else:
                entry_data[field] = 0

        entry = STQuest.objects.get(id=id)
        for key, value in entry_data.items():
            setattr(entry, key, value)
        entry.save()
        if "actors" in data:
            actors = User.objects.filter(id__in=data["actors"])
            entry.actors.set(actors)
        else:
            entry.actors.set([])

        return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = STQuest.objects.get(id=id)
        entry.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VSTBonusPenalty(request, id):
    if request.method == "GET":
        entry = STBonusPenalty.objects.get(id=id)
        serializer = STBonusPenaltySerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
            user = User.objects.get(id=data["user"])
            quests = Quest.objects.filter(id__in=data["quests"])

            entry = STBonusPenalty.objects.get(id=id)
            entry.date = formatted_date
            entry.user = user
            entry.amount = data["amount"]
            entry.name = data["name"]
            entry.type = data["type"]
            entry.save()
            entry.quests.set(quests)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = STBonusPenalty.objects.get(id=id)
        entry.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VSTExpenseCategory(request, id):
    if request.method == "GET":
        entry = STExpenseCategory.objects.get(id=id)
        serializer = STExpenseCategorySerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            entry = STExpenseCategory.objects.get(id=id)
            entry.name = data["name"]
            entry.save()

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = STExpenseCategory.objects.get(id=id)
        entry.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VSTExpenseSubCategory(request, id):
    if request.method == "GET":
        entry = STExpenseSubCategory.objects.get(id=id)
        serializer = STExpenseSubCategorySerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            category = STExpenseCategory.objects.get(name=data["category"])

            entry = STExpenseSubCategory.objects.get(id=id)
            entry.name = data["name"]
            entry.category = category
            entry.save()

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = STExpenseSubCategory.objects.get(id=id)
        entry.delete()

        return Response(status=200)


# POST
@api_view(["POST"])
def CreateUser(request):
    if request.method == "POST":
        # try:
        data1 = json.loads(request.body)
        data = {key: value for key, value in data1.items() if value not in ("", None)}        

        optional_fields = ["middle_name", "email", "phone_number"]

        user_data = {
            "username": data["username"],
            "last_name": data["last_name"],
            "first_name": data["first_name"],
            "password": data["password"],
        }

        user_data01 ={}
        user_data02 ={}
        user_data03 ={}
        user_data04 ={}

        if "quest" in data:
            quest = Quest.objects.get(id=data["quest"])
            user_data01 = {
                "quest": quest
            }

        if "date_of_birth" in data:
            formatted_date = datetime.strptime(data['date_of_birth'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
            user_data02 = {
                "date_of_birth": formatted_date,
            }

        if "range_staj" in data:
            formatted_start = datetime.fromisoformat(data["range_staj"][0]).date()
            formatted_end = datetime.fromisoformat(data["range_staj"][1]).date()
            user_data04 = {
                "range_staj_start": formatted_start,
                "range_staj_end": formatted_end
            }

        if "quest_staj" in data:
            quest_staj = Quest.objects.get(id=data["quest_staj"])
            user_data03 = {
                "quest_staj": quest_staj
            }
        
        user_data.update(user_data01)
        user_data.update(user_data02)
        user_data.update(user_data04)
        user_data.update(user_data03)

        for field in optional_fields:
            if field in data:
                user_data[field] = data[field]

        user = User.objects.create_user(**user_data)

        if "roles" in data:
            roles = Role.objects.filter(id__in=data["roles"])
            user.roles.set(roles)

        return JsonResponse({"message": "Пользователь успешно создан"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


# @api_view(["POST"])
# def CreateRole(request):
#     if request.method == "POST":
#         try:
#             # data = json.loads(request.body)

#             # formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
#             # sub_category = ExpenseSubCategory.objects.get(id=data["subCategory"])
#             # quests = Quest.objects.filter(id__in=data["quests"])

#             # expense_data = {
#             #     "date": formatted_date,
#             #     "amount": data["amount"],
#             #     "name": data["name"],
#             #     "sub_category": sub_category,
#             # }

#             # expense = Expense(**expense_data)
#             # expense.save()
#             # expense.quests.set(quests)

#             return JsonResponse({"message": "Запись успешно создана"}, status=201)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     else:
#         return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateQuest(request):
    if request.method == "POST":
        # try:
        data1 = json.loads(request.body)
        data = {key: value for key, value in data1.items() if value not in ("", None)}

        # optional_fields = []

        quest_data = {
            "name": data["name"],
            "address": data["address"],
            "actor_rate": int(data["actor_rate"]),
            "administrator_rate": int(data["administrator_rate"]),
            "cost_weekdays": data["cost_weekdays"],
            "cost_weekends": data["cost_weekends"],
            "duration_minute": data["duration_minute"],
        }

        quest = Quest(**quest_data)
        quest.save()
        if "special_versions" in data:
            special_versions = Quest.objects.filter(id__in=data["special_versions"])
            quest.special_versions.set(special_versions)
        if "versions" in data:
            versions = QuestVersion.objects.filter(id__in=data["versions"])
            quest.versions.set(versions)

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateQuestVersion(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            entry_data = {
                "name": data["name"],
            }

            entry = QuestVersion(**entry_data)
            entry.save()

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


import base64
from django.core.files.base import ContentFile


@api_view(["POST"])
def CreateSTExpense(request):
    if request.method == "POST":
        # try:
        data = json.loads(request.body)
        # attachment = data['attachment'][0]['thumbUrl']
        # attachment_name = data['attachment'][0]['name']
        # print(attachment)
        # image_data = base64.b64decode(attachment)
        # image_file = ContentFile(image_data, name=attachment_name)

        formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        sub_category = STExpenseSubCategory.objects.get(id=data["sub_category"])
        
        quests = Quest.objects.filter(id__in=data["quests"])

        expense_data = {
            "date": formatted_date,
            "amount": data["amount"],
            "name": data["name"],
            "sub_category": sub_category,
            "paid_from": data['paid_from'],
            # "who_paid": who_paid,
            # "who_paid_amount": data["who_paid_amount"],
            # "image": request.data['image'][0]
        }

        expense = STExpense(**expense_data)
        # expense.attachment=image_file
        expense.save()
        expense.quests.set(quests)

        if "who_paid" in data:
            who_paid = User.objects.get(id=data["who_paid"])
            expense.paid.set(who_paid)
        if "paid_tax" in data:
            paid_tax = User.objects.filter(id__in=data["paid_tax"])
            expense.paid.set(paid_tax)

        for quest in quests:
            if data["paid_from"] == "cash_register":
                local_data = {
                    "date": formatted_date,
                    "amount": -int(data["amount"]),
                    "description": data["name"],
                    "quest": quest,
                    "stexpense": expense,
                }

                cash_register = QCashRegister(**local_data)
                cash_register.save()
            elif data["paid_from"] == "work_card":
                local_data = {
                    "date": formatted_date,
                    "amount": int(data["amount"]),
                    "description": data["name"],
                    "quest": quest,
                    "stexpense": expense,
                }

                cash_register = WorkCardExpense(**local_data)
                cash_register.save()
            elif data["paid_from"] == "from_their":
                who_paid = User.objects.get(id=data["who_paid"])
                local_data = {
                    "date": formatted_date,
                    "amount": int(data["amount"]),
                    "description": data["name"],
                    "who_paid": who_paid,
                    "quest": quest,
                    "stexpense": expense,
                }

                cash_register = ExpenseFromTheir(**local_data)
                cash_register.save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        # return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def CreateSTQuest(request):
    if request.method == "POST":
        # try:
        data1 = json.loads(request.body)
        data = {key: value for key, value in data1.items() if value not in ("", None)}

        formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        formatted_time_without_3_hours = datetime.fromisoformat(data['time'].replace('Z', '')).time()
        formatted_time = (
            datetime.combine(datetime.min, formatted_time_without_3_hours)
            + timedelta(hours=3)
        ).time()
        quest = Quest.objects.get(id=data["quest"])
        administrator = User.objects.get(id=data["administrator"])

        count_easy_work = 1

        optional_fields = [
            "add_players",
            "actor_second_actor",
            "discount_sum",
            "discount_desc",
            "room_sum",
            "room_sum_after",
            "video",
            "birthday_congr",
            "easy_work",
            "night_game",
            "is_package",
            "is_video_review",
            "cash_payment",
            "cashless_payment",
            "cash_delivery",
            "cashless_delivery",
            "cash_payment_after",
            "cashless_payment_after",
            "cash_delivery_after",
            "cashless_delivery_after",
            "client_name",
            "prepayment",
            "photomagnets_quantity_after",
        ]

        entry_data = {
            "quest": quest,
            "date": formatted_date,
            "time": formatted_time,
            "quest_cost": data["quest_cost"],
            "administrator": administrator,
            "created_by": request.user
        }

        if "animator" in data:
            count_easy_work += 1
            animator = User.objects.get(id=data["animator"])
            entry_data['animator'] = animator
        if "room_employee_name" in data:
            room_employee_name = User.objects.get(id=data["room_employee_name"])
            entry_data['room_employee_name'] = room_employee_name
            
        if ("photomagnets_quantity" in data) and (quest.address != "Афанасьева, 13"):
            entry_data['photomagnets_quantity'] = int(data["photomagnets_quantity"])

        for field in optional_fields:
            if field in data:
                entry_data[field] = data[field]

        entry = STQuest(**entry_data)
        create_travel(entry)
        entry.save()
        if "actors" in data:
            actors = User.objects.filter(id__in=data["actors"])
            entry.actors.set(actors)

        create_qincome(data, entry)

        if "room_employee_name" in data:
            QSalary(**{
                "date": formatted_date,
                "amount": 100,
                "name": "Комната",
                "user": room_employee_name,
                "stquest": entry,
            }).save()

        if "cash_payment" in data and "cash_delivery" in data:
            create_qcash_register_from_stquest(data, entry)

        if ("is_video_review" in data):
            QSalary(**{
                "date": formatted_date,
                "amount": 50,
                "name": "Видео отзыв",
                "user": administrator,
                "stquest": entry,
            }).save()

        if ("video_after" in data):
            QSalary(**{
                "date": formatted_date,
                "amount": 200,
                "name": "Видео после",
                "user": administrator,
                "stquest": entry,
            }).save()

        if ("employee_with_staj" in data):
            employees = User.objects.filter(id__in=data['employee_with_staj'])
            for employee in employees:
                QSalary(**{
                        "date": formatted_date,
                        "amount": 250,
                        "name": "Игра",
                        "user": employee,
                        "stquest": entry
                    }).save()

        if (("video" in data) or (data['is_video_review'] == True) or ("video_after" in data)) and ("client_name" in data):
            # if data['video'] != 0:
            print(data)
            QVideo(**{
                "date": formatted_date,
                "time": formatted_time,
                "client_name": data['client_name'],
                "sent": False,
                "is_package": data['is_package'],
                "note": "",
                "quest": quest,
                "stquest": entry
            }).save()

        if "is_package" in data:
            if data['is_package'] == True:
                QSalary(**{
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Видео",
                    "user": administrator,
                    "stquest": entry,
                }).save()
                QSalary(**{
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Бонус за пакет",
                    "user": administrator,
                    "stquest": entry,
                }).save()
                QSalary(**{
                    "date": formatted_date,
                    "amount": 30,
                    "name": "Фотомагнит акц.",
                    "user": administrator,
                    "stquest": entry,
                }).save()

        if "night_game" in data:
            if "administrator" in data:
                administrator = User.objects.get(id=data['administrator'])
                night_game_salary_data_administrator = {
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Ночная игра",
                    "user": administrator,
                    "stquest": entry,
                }
                QSalary(**night_game_salary_data_administrator).save()
            if "animator" in data:
                animator = User.objects.get(id=data['animator'])
                QSalary(**{
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Ночная игра",
                    "user": animator,
                    "stquest": entry,
                }).save()

        if "actors" in data:
            count_easy_work += actors.count()

            for actor in actors:
                if "night_game" in data:
                    night_game_salary_data = {
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Ночная игра",
                        "user": actor,
                        "stquest": entry,
                    }
                    QSalary(**night_game_salary_data).save()

                if "easy_work" in data:
                    easy_work_salary_data = {
                        "date": formatted_date,
                        "amount": int(data["easy_work"]) / count_easy_work,
                        "name": "Простой",
                        "user": actor,
                        "stquest": entry,
                    }
                    QSalary(**easy_work_salary_data).save()

                game_salary_data = {
                    "date": formatted_date,
                    "amount": quest.actor_rate,
                    "name": "Игра",
                    "user": actor,
                    "stquest": entry,
                }
                QSalary(**game_salary_data).save()

        if "actors_half" in data:
            count_easy_work += actors.count()

            for actor in actors:
                if "night_game" in data:
                    night_game_salary_data = {
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Ночная игра",
                        "user": actor,
                        "stquest": entry,
                    }
                    QSalary(**night_game_salary_data).save()

                if "easy_work" in data:
                    easy_work_salary_data = {
                        "date": formatted_date,
                        "amount": int(data["easy_work"]) / count_easy_work,
                        "name": "Простой",
                        "user": actor,
                        "stquest": entry,
                    }
                    QSalary(**easy_work_salary_data).save()

                game_salary_data = {
                    "date": formatted_date,
                    "amount": quest.actor_rate / 2,
                    "name": "Игра",
                    "user": actor,
                    "stquest": entry,
                }
                QSalary(**game_salary_data).save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTBonusPenalty(request):
    if request.method == "POST":
        # try:
        data1 = json.loads(request.body)
        data = {key: value for key, value in data1.items() if value not in ("", None)}

        formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        user = User.objects.get(id=data["user"])            

        optional_fields = ["name"]

        entry_data = {
            "date": formatted_date,
            "amount": data["amount"],
            "type": data["type"],
            "user": user,
        }

        for field in optional_fields:
            if field in data:
                entry_data[field] = data[field]

        entry = STBonusPenalty(**entry_data)
        entry.save()
        
        if "quests" in data:
            quests = Quest.objects.filter(id__in=data["quests"])
            entry.quests.set(quests)

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTExpenseCategory(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            entry_data = {
                "name": data["name"],
            }

            entry = STExpenseCategory(**entry_data)
            entry.save()

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTExpenseSubCategory(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            category = STExpenseCategory.objects.get(name=data["category"])

            entry_data = {
                "name": data["name"],
                "category": category,
            }

            entry = STExpenseSubCategory(**entry_data)
            entry.save()

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)
