import json

from django.http import JsonResponse
from django.db.models import Q
from django.db.models import Count

from datetime import datetime, date
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

import time

from .utils import (
    create_non_empty_dict,
    convert_to_date,
    create_travel,
    create_qincome,
    create_qcash_register_from_stquest,
    create_qcash_register_from_stexpense,
    convert_with_children,
    convert_with_children2,
)

from django.db.models import Count
from django.db.models.functions import TruncDate

from collections import defaultdict


# GET
@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def AllUsers(request):
    if request.method == "GET":
        # if request.user.is_superuser:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)
        # else:
        #     return Response(status=401)


# GET
@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def Users(request):
    if request.method == "GET":
        # if request.user.is_superuser:
        users = User.objects.exclude(email="admin@gmail.com")
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
                    "actor_or_second_actor_or_animator": 0,
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
                    "video_as_a_gift": False,
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
            serialized_employees_first_time = []
            for (
                employee_first_time
            ) in (
                entry.employees_first_time.all()
            ):  # Assuming actors is a related manager (e.g., a ManyToManyField or ForeignKey)
                serialized_half_actor = {
                    "id": employee_first_time.id,
                    "last_name": employee_first_time.last_name,
                    "first_name": employee_first_time.first_name,
                    "middle_name": employee_first_time.middle_name,
                }

                # Append the serialized actor to the list
                serialized_employees_first_time.append(serialized_employees_first_time)

            # entry_dict[date_timestamp]["quest"] = {
            #     "id": entry.quest.id,
            #     "name": entry.quest.name,
            # }
            entry_dict[date_timestamp]["quest"] = {"Итоги за день"}
            entry_dict[date_timestamp]["quest_cost"] += entry.quest_cost
            entry_dict[date_timestamp]["add_players"] += entry.add_players
            entry_dict[date_timestamp][
                "actor_or_second_actor_or_animator"
            ] += entry.actor_or_second_actor_or_animator
            entry_dict[date_timestamp]["discount_sum"] += entry.discount_sum
            entry_dict[date_timestamp]["discount_desc"] = entry.discount_desc
            entry_dict[date_timestamp]["room_sum"] += entry.room_sum
            entry_dict[date_timestamp]["room_quantity"] += entry.room_quantity
            entry_dict[date_timestamp]["room_employee_name"] = {
                "id": entry.room_employee_name.id if entry.room_employee_name else None,
                "last_name": (
                    entry.room_employee_name.last_name
                    if entry.room_employee_name
                    else None
                ),
                "first_name": (
                    entry.room_employee_name.first_name
                    if entry.room_employee_name
                    else None
                ),
                "middle_name": (
                    entry.room_employee_name.middle_name
                    if entry.room_employee_name
                    else None
                ),
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
            entry_dict[date_timestamp][
                "employees_first_time"
            ] = serialized_employees_first_time
            entry_dict[date_timestamp]["animator"] = {
                "id": entry.animator.id if entry.animator else None,
                "last_name": entry.animator.last_name if entry.animator else None,
                "first_name": entry.animator.first_name if entry.animator else None,
                "middle_name": entry.animator.middle_name if entry.animator else None,
            }
            entry_dict[date_timestamp]["is_package"] = entry.is_package
            entry_dict[date_timestamp]["is_video_review"] = entry.is_video_review
            entry_dict[date_timestamp]["video_as_a_gift"] = entry.video_as_a_gift
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
                    "actor_or_second_actor_or_animator": entry.actor_or_second_actor_or_animator,
                    "discount_sum": entry.discount_sum,
                    "discount_desc": entry.discount_desc,
                    "room_sum": entry.room_sum,
                    "room_quantity": entry.room_quantity,
                    "room_employee_name": {
                        "id": (
                            entry.room_employee_name.id
                            if entry.room_employee_name
                            else None
                        ),
                        "last_name": (
                            entry.room_employee_name.last_name
                            if entry.room_employee_name
                            else None
                        ),
                        "first_name": (
                            entry.room_employee_name.first_name
                            if entry.room_employee_name
                            else None
                        ),
                        "middle_name": (
                            entry.room_employee_name.middle_name
                            if entry.room_employee_name
                            else None
                        ),
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
                    "employees_first_time": serialized_employees_first_time,
                    "animator": {
                        "id": entry.animator.id if entry.animator else None,
                        "last_name": (
                            entry.animator.last_name if entry.animator else None
                        ),
                        "first_name": (
                            entry.animator.first_name if entry.animator else None
                        ),
                        "middle_name": (
                            entry.animator.middle_name if entry.animator else None
                        ),
                    },
                    "is_package": entry.is_package,
                    "is_video_review": entry.is_video_review,
                    "video_as_a_gift": entry.video_as_a_gift,
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
        quests = Quest.objects.filter(
            Q(parent_quest__isnull=True) & Q(special_versions__isnull=True)
        )
        serializer = QuestSerializer(quests, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def QuestsWithParentQuest(request):
    if request.method == "GET":
        quests = Quest.objects.filter(parent_quest__isnull=False)
        serializer = QuestSerializer(quests, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def QuestsWithSpecailVersions(request):
    if request.method == "GET":
        quests = Quest.objects.all()
        serializer = QuestSerializer(quests, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def QuestsWithoutParentQuest(request):
    if request.method == "GET":
        quests = Quest.objects.filter(parent_quest__isnull=True)
        serializer = QuestSerializer(quests, many=True)

        return Response(serializer.data)


# @api_view(["GET"])
# def QuestsWithSpecailVersionsAndVersions(request):
#     if request.method == "GET":
#         quests = QuestVersion.objects.all()
#         serializer = QuestSerializer(quests, many=True)

#         return Response(serializer.data)


# @api_view(["GET"])
# def QuestVersions(request):
#     if request.method == "GET":
#         quest_versions = QuestVersion.objects.all()
#         serializer = QuestVersionSerializer(quest_versions, many=True)

#         return Response(serializer.data)


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
@permission_classes([IsAuthenticated])
def STQuests(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        entries = []

        if request.user.is_superuser == True:
            entries = STQuest.objects.all().order_by("date")
        else:
            entries = STQuest.objects.filter(created_by=request.user).order_by("date")

        # entries = STQuest.objects.all().order_by("date")

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
                    "actor_or_second_actor_or_animator": 0,
                    "discount_sum": 0,
                    "discount_desc": "",
                    "room_sum": 0,
                    "room_quantity": 0,
                    "room_employee_name": "",
                    "video": 0,
                    "video_after": 0,
                    "photomagnets_quantity": 0,
                    "photomagnets_sum": 0,
                    "birthday_congr": 0,
                    "easy_work": 0,
                    "night_game": 0,
                    "administrator": "",
                    "actors": "",
                    "actors_half": "",
                    "administrators_half": "",
                    "employees_first_time": "",
                    "animator": "",
                    "is_package": False,
                    "is_video_review": False,
                    "video_as_a_gift": False,
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
            serialized_administrators_half = []
            for (
                administrator_half
            ) in (
                entry.administrators_half.all()
            ):  # Assuming actors is a related manager (e.g., a ManyToManyField or ForeignKey)
                serialized_administrator_half = {
                    "id": administrator_half.id,
                    "last_name": administrator_half.last_name,
                    "first_name": administrator_half.first_name,
                }

                # Append the serialized actor to the list
                serialized_administrators_half.append(serialized_administrator_half)
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

            serialized_employees_first_time = []
            for (
                employee_first_time
            ) in (
                entry.employees_first_time.all()
            ):  # Assuming actors is a related manager (e.g., a ManyToManyField or ForeignKey)
                serialized_employee_first_time = {
                    "id": employee_first_time.id,
                    "last_name": employee_first_time.last_name,
                    "first_name": employee_first_time.first_name,
                    "middle_name": employee_first_time.middle_name,
                }

                # Append the serialized actor to the list
                serialized_employees_first_time.append(serialized_employee_first_time)

            # entry_dict[date_timestamp]["quest"] = {
            #     "id": entry.quest.id,
            #     "name": entry.quest.name,
            # }
            entry_dict[date_timestamp]["quest"] = "Итого за день"
            entry_dict[date_timestamp]["quest_cost"] += entry.quest_cost
            entry_dict[date_timestamp]["add_players"] += entry.add_players
            entry_dict[date_timestamp][
                "actor_or_second_actor_or_animator"
            ] += entry.actor_or_second_actor_or_animator
            entry_dict[date_timestamp]["discount_sum"] += entry.discount_sum
            entry_dict[date_timestamp]["discount_desc"] = entry.discount_desc
            entry_dict[date_timestamp]["room_sum"] += entry.room_sum
            entry_dict[date_timestamp]["room_quantity"] += entry.room_quantity
            entry_dict[date_timestamp]["room_employee_name"] = {
                "id": entry.room_employee_name.id if entry.room_employee_name else None,
                "last_name": (
                    entry.room_employee_name.last_name
                    if entry.room_employee_name
                    else None
                ),
                "first_name": (
                    entry.room_employee_name.first_name
                    if entry.room_employee_name
                    else None
                ),
                "middle_name": (
                    entry.room_employee_name.middle_name
                    if entry.room_employee_name
                    else None
                ),
            }

            entry_dict[date_timestamp]["video"] += entry.video
            entry_dict[date_timestamp]["video_after"] += entry.video_after
            entry_dict[date_timestamp][
                "photomagnets_quantity"
            ] += entry.photomagnets_quantity
            entry_dict[date_timestamp]["photomagnets_sum"] += entry.photomagnets_sum
            entry_dict[date_timestamp]["birthday_congr"] += entry.birthday_congr
            entry_dict[date_timestamp]["easy_work"] += entry.easy_work
            entry_dict[date_timestamp]["night_game"] += entry.night_game
            entry_dict[date_timestamp]["administrator"] = {
                "id": entry.administrator.id if entry.administrator else None,
                "last_name": (
                    entry.administrator.last_name if entry.administrator else None
                ),
                "first_name": (
                    entry.administrator.first_name if entry.administrator else None
                ),
                "middle_name": (
                    entry.created_by.middle_name if entry.administrator else None
                ),
            }
            entry_dict[date_timestamp]["actors"] = serialized_actors
            entry_dict[date_timestamp]["actors_half"] = serialized_half_actors
            entry_dict[date_timestamp][
                "administrators_half"
            ] = serialized_administrators_half
            entry_dict[date_timestamp][
                "employees_first_time"
            ] = serialized_employees_first_time
            entry_dict[date_timestamp]["animator"] = {
                "id": entry.animator.id if entry.animator else None,
                "last_name": entry.animator.last_name if entry.animator else None,
                "first_name": entry.animator.first_name if entry.animator else None,
                "middle_name": entry.animator.middle_name if entry.animator else None,
            }
            entry_dict[date_timestamp]["is_package"] = entry.is_package
            entry_dict[date_timestamp]["is_video_review"] = entry.is_video_review
            entry_dict[date_timestamp]["video_as_a_gift"] = entry.video_as_a_gift
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
                    "actor_or_second_actor_or_animator": entry.actor_or_second_actor_or_animator,
                    "discount_sum": entry.discount_sum,
                    "discount_desc": entry.discount_desc,
                    "room_sum": entry.room_sum,
                    "room_quantity": entry.room_quantity,
                    "room_employee_name": {
                        "id": (
                            entry.room_employee_name.id
                            if entry.room_employee_name
                            else None
                        ),
                        "last_name": (
                            entry.room_employee_name.last_name
                            if entry.room_employee_name
                            else None
                        ),
                        "first_name": (
                            entry.room_employee_name.first_name
                            if entry.room_employee_name
                            else None
                        ),
                        "middle_name": (
                            entry.room_employee_name.middle_name
                            if entry.room_employee_name
                            else None
                        ),
                    },
                    "video": entry.video,
                    "video_after": entry.video_after,
                    "photomagnets_quantity": entry.photomagnets_quantity,
                    "photomagnets_sum": entry.photomagnets_sum,
                    "birthday_congr": entry.birthday_congr,
                    "easy_work": entry.easy_work,
                    "night_game": entry.night_game,
                    "administrator": {
                        "id": entry.administrator.id if entry.administrator else None,
                        "last_name": (
                            entry.administrator.last_name
                            if entry.administrator
                            else None
                        ),
                        "first_name": (
                            entry.administrator.first_name
                            if entry.administrator
                            else None
                        ),
                        "middle_name": (
                            entry.administrator.middle_name
                            if entry.administrator
                            else None
                        ),
                    },
                    "actors": serialized_actors,
                    "actors_half": serialized_half_actors,
                    "administrators_half": serialized_administrators_half,
                    "employees_first_time": serialized_employees_first_time,
                    "animator": {
                        "id": entry.animator.id if entry.animator else None,
                        "last_name": (
                            entry.animator.last_name if entry.animator else None
                        ),
                        "first_name": (
                            entry.animator.first_name if entry.animator else None
                        ),
                        "middle_name": (
                            entry.animator.middle_name if entry.animator else None
                        ),
                    },
                    "is_package": entry.is_package,
                    "is_video_review": entry.is_video_review,
                    "video_as_a_gift": entry.video_as_a_gift,
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
def UserSTExpenses(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        expenses = STExpense.objects.filter(created_by=request.user).order_by("date")

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
def STExpenses(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        expenses = []

        if request.user.is_superuser == True:
            expenses = STExpense.objects.all().order_by("date")
        else:
            expenses = STExpense.objects.filter(created_by=request.user).order_by(
                "date"
            )

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
        data = create_non_empty_dict(request.body)

        user = User.objects.get(id=id)
        user.last_name = data["last_name"]
        user.first_name = data["first_name"]
        user.is_active = data["is_active"]
        if "middle_name" in data:
            user.middle_name = data["middle_name"]
        if "date_of_birth" in data:
            formatted_date = datetime.strptime(
                data["date_of_birth"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date()
            user.date_of_birth = formatted_date
        if "internship_period" in data:
            internship_period_start = datetime.strptime(
                data["internship_period"][0], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date()
            internship_period_end = datetime.strptime(
                data["internship_period"][1], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date()
            user.internship_period_start = internship_period_start
            user.internship_period_end = internship_period_end
        if "email" in data:
            user.email = data["email"]
        if "phone_number" in data:
            user.phone_number = data["phone_number"]
        if "phone_number_for_transfer" in data:
            user.phone_number_for_transfer = data["phone_number_for_transfer"]
        if "bank" in data:
            user.bank = data["bank"]
        if "quest" in data:
            quest = Quest.objects.get(name=data["quest"])
            user.quest = quest
        if "password" in data:
            user.set_password(data["password"])

        user.save()
        if "roles" in data:
            user.roles.set(Role.objects.filter(id__in=data["roles"]))
        if "quests_for_videos" in data:
            user.quests_for_videos.set(
                Quest.objects.filter(id__in=data["quests_for_videos"])
            )

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
    #         quests = Quest.objects.filter(name__in=data["quests"])

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
        entry.cost_weekdays_with_package = data["cost_weekdays_with_package"]
        entry.cost_weekends_with_package = data["cost_weekends_with_package"]
        entry.administrator_rate = data["administrator_rate"]
        entry.actor_rate = data["actor_rate"]
        entry.duration_in_minute = data["duration_in_minute"]
        if "special_versions" in data:
            special_versions = Quest.objects.filter(id__in=data["special_versions"])
            entry.special_versions.set(special_versions)
        # if "versions" in data:
        #     versions = QuestVersion.objects.filter(id__in=data["versions"])
        #     entry.versions.set(versions)
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
        entry = Quest.objects.get(id=id)
        serializer = QuestVersionSerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            entry = Quest.objects.get(id=id)
            entry.name = data["name"]
            entry.cost_weekdays = data["cost_weekdays"]
            entry.cost_weekends = data["cost_weekends"]
            entry.cost_weekdays_with_package = data["cost_weekdays_with_package"]
            entry.cost_weekends_with_package = data["cost_weekends_with_package"]
            entry.parent_quest = Quest.objects.get(id=data["parent_quest"])
            entry.save()

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = Quest.objects.get(id=id)
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

        # value = 0
        # tooltip = ""
        # total = 0

        for income in incomes:
            # value = income.game
            # tooltip = ""
            value = 0
            tooltip = ""
            total = 0

            date_timestamp = date_to_timestamp(
                income.date
            )  # Convert date to Unix timestamp
            date_str = income.date.strftime("%d.%m.%Y")  # Format date as DD.MM.YYYY

            if date_timestamp not in income_dict:
                income_dict[date_timestamp] = {
                    "id": date_timestamp,
                    "key": str(date_timestamp),  # Use Unix timestamp as the key
                    "date_time": date_str,
                    # "game": 0,
                    "game": {
                        "value": 0,
                        "tooltip": "",
                    },
                    "room": 0,
                    "video": 0,
                    "video_after": 0,
                    "photomagnets": 0,
                    "actor": 0,
                    "total": 0,
                    "paid_cash": 0,
                    "paid_non_cash": 0,
                    "children": [],
                }

            child_id = str(income.id)  # Use income.id as the child's key
            income_time = income.time.strftime("%H:%M")  # Format time as HH:MM

            income_game = {"value": value, "tooltip": tooltip}

            value += income.game
            total += income.game

            if len(income.stquest.quest.special_versions.all()) != 0:
                # tooltip = f"{income.stquest.quest} ({income.stquest.quest_cost})<br>"
                tooltip = f"{income.stquest.quest} ({value*2})<br>"
            if income.is_package == True:
                tooltip += "Пакет<br>"
            if income.discount_sum > 0:
                value -= income.discount_sum
                total -= income.discount_sum
                tooltip += (
                    f"Скидка - {income.discount_sum} ({income.discount_desc})<br>"
                )
            if income.easy_work > 0:
                tooltip += f"Простой - {income.easy_work}<br>"

            income_game = {
                "value": value,
                "tooltip": tooltip,
            }

            income_dict[date_timestamp]["room"] += income.room
            income_dict[date_timestamp]["video_after"] += income.video_after
            income_dict[date_timestamp]["video"] += income.video
            income_dict[date_timestamp]["photomagnets"] += income.photomagnets
            income_dict[date_timestamp]["actor"] += income.actor
            income_dict[date_timestamp]["total"] += (
                value  # income.game
                + income.room
                + income.video_after
                + income.video
                + income.photomagnets
                + income.actor
            )
            income_dict[date_timestamp]["paid_cash"] += income.paid_cash
            income_dict[date_timestamp]["paid_non_cash"] += income.paid_non_cash

            total = (
                value
                + income.room
                + income.video_after
                + income.video
                + income.photomagnets
                + income.actor
            )

            income_dict[date_timestamp]["game"]["value"] += value  # Update sums

            # print('value', value)
            # print('total', total)

            income_dict[date_timestamp]["children"].append(
                {
                    "id": income.id,
                    "key": child_id,
                    "date_time": income_time,  # Use formatted time
                    # "game": income.game,
                    "game": income_game,
                    "room": income.room,
                    "video": income.video,
                    "video_after": income.video_after,
                    "photomagnets": income.photomagnets,
                    "actor": income.actor,
                    # "total": income.total,
                    "total": total,
                    "quest": income.quest.id,
                    "paid_cash": income.paid_cash,
                    "paid_non_cash": income.paid_non_cash,
                }
            )

            # print(income_dict)

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

        head = [{"title": "Зарплаты", "dataIndex": "salary", "key": "salary"}]
        body = []
        body_data = []

        salaries_data = []
        expenses_data = []

        variable = {}

        expenses_by_latin_name = {}

        sub_categories = STExpenseSubCategory.objects.all()

        for sub_category in sub_categories:
            sub_category_category_id = sub_category.category.id
            categories = STExpenseCategory.objects.filter(id=sub_category_category_id)
            for category in categories:
                variable[category.name] = []

        for sub_category in sub_categories:
            sub_category_category_id = sub_category.category.id

            categories = STExpenseCategory.objects.filter(id=sub_category_category_id)

            for category in categories:
                # if category.latin_name != sub_category.latin_name:
                # print(variable[category.name])
                variable[category.name].append(
                    {
                        "title": sub_category.name,
                        "dataIndex": sub_category.latin_name,
                        "key": sub_category.latin_name,
                    }
                )
                # else:
                #     variable[category.name].append(
                #         {
                #             "title": sub_category.name,
                #             "dataIndex": sub_category.latin_name,
                #             "key": sub_category.latin_name,
                #         }
                #     )

            expenses_by_latin_name[sub_category.latin_name] = {"tooltip": ""}
            expenses_by_latin_name[sub_category.latin_name].update({"value": 0})

        # print(variable)

        for item in variable.items():
            item_key = item[0]
            item_value = item[1]

            if len(item_value) > 0 and len(item_value) != 1:
                head.append({"title": item_key, "children": item_value})
            elif len(item_value) == 1:
                head.append(
                    {
                        "title": item_value[0]["title"],
                        "dataIndex": item_value[0]["dataIndex"],
                        "key": item_value[0]["key"],
                    }
                )
        quest = Quest.objects.get(id=id)

        dates = []
        sub_categories2 = []

        salaries_dates = []
        expenses_dates = []
        bonuses_penalties_dates = []

        salaries_by_date = {}
        expenses_by_date = {}
        # expenses_by_date = {}
        # salaries_variable = {}

        # salary_names_by_user_id = {}
        salary_names_by_salary_date_user_id = {}
        bonus_penalty_names_by_bonus_penalty_date_user_id = {}

        # salaries = QSalary.objects.filter(stquest__quest=quest)
        salaries = QSalary.objects.filter(quest=quest)
        expenses = STExpense.objects.filter(
            Q(quests=quest) | Q(quests__parent_quest=quest)
        )
        bonuses_penalties = STBonusPenalty.objects.filter(
            Q(quests=quest) | Q(quests__parent_quest=quest)
        )
        # bonuses_penalties = STBonusPenalty.objects.filter(quests=quest)

        for salary in salaries:
            salary_date = salary.date.strftime("%d.%m.%Y")
            dates.append(salary_date)
            salaries_dates.append(salary_date)

            salary_names_by_salary_date_user_id[salary_date] = {}
            salaries_by_date[salary_date] = {}

        for expense in expenses:
            expense_date = expense.date.strftime("%d.%m.%Y")
            dates.append(expense_date)
            expenses_dates.append(expense_date)

            expenses_by_date[expense_date] = {}

        for salary in salaries:
            salary_date = salary.date.strftime("%d.%m.%Y")
            salary_names_by_salary_date_user_id[salary_date].update(
                {salary.user.id: []}
            )

        for bonus_penalty in bonuses_penalties:
            bonus_penalty_date = bonus_penalty.date.strftime("%d.%m.%Y")
            if (
                bonus_penalty_date
                not in bonus_penalty_names_by_bonus_penalty_date_user_id
            ):
                bonus_penalty_names_by_bonus_penalty_date_user_id[
                    bonus_penalty_date
                ] = {}
            bonus_penalty_names_by_bonus_penalty_date_user_id[
                bonus_penalty_date
            ].update({bonus_penalty.name: {"tooltip": "", "value": 0}})

            dates.append(bonus_penalty_date)

        for expense in expenses:
            expense_date = expense.date.strftime("%d.%m.%Y")
            expenses_by_date[expense_date].update(
                {expense.sub_category.latin_name: {"tooltip": "", "value": 0}}
            )

        # for expense in expenses:
        # expenses_dates.append(expense.date.strftime("%d.%m.%Y"))

        # salaries_dates = set(salaries_dates)
        # expenses_dates = set(expenses_dates)
        # print('salaries_dates', salaries_dates)
        # print('expenses_dates', expenses_dates)

        # print(set(dates))

        sub_categories22 = STExpenseSubCategory.objects.all()

        arr_dates = set(dates)

        for sub_category22 in sub_categories22:
            sub_categories2.append(sub_category22.latin_name)

        # print(sub_categories2)
        # sub_categories2 = ['rate', 'public_service', 'other_expenses']

        # print(salaries_names_by_date)

        # for item in head:
        #     key = item['key']
        #     body.append({str(salary_date): {key: {}}})

        # print(salary_names_by_salary_date_user_id)

        user_taxi = {}

        users = []
        salary_names = []
        for salary in salaries:
            name = salary.name
            users.append(
                {
                    "id": salary.user.id,
                    "first_name": salary.user.first_name,
                    "last_name": salary.user.last_name,
                }
            )
            salary_names.append(name)
        users = [dict(t) for t in {tuple(d.items()) for d in users}]
        salary_names = set(salary_names)

        # salary_by_date = {}

        # print(salary_names_by_user_id)

        for salary in salaries:
            salary_date = salary.date.strftime("%d.%m.%Y")

            if (
                salary.name
                not in salary_names_by_salary_date_user_id[salary_date][salary.user.id]
            ):
                salary_names_by_salary_date_user_id[salary_date][salary.user.id].append(
                    salary.name
                )

            # if salary.name not in salary_names_by_user_id[salary.user.id]:
            #     salary_names_by_user_id[salary.user.id].append(salary.name)

            salaries_by_date[salary_date].update(
                {
                    salary.user.id: {
                        "first_name": salary.user.first_name,
                        "last_name": salary.user.last_name,
                        "value": 0,
                        "salary_data": {},
                    }
                }
            )

        for date in dates:
            user_taxi[date] = {}
            for user in users:
                user_id = user["id"]
                user_taxi[date][user_id] = False

        for salary in salaries:
            salary_date = salary.date.strftime("%d.%m.%Y")

            expenses_by_user = STExpense.objects.filter(
                Q(name="Такси") & Q(employees=salary.user) & Q(date=salary.date)
            )
            if len(expenses_by_user) != 0:
                user_taxi[salary_date][salary.user.id] = True

            for item in salary_names_by_salary_date_user_id[salary_date].items():
                item_user_id = item[0]
                item_salary_names = item[1]

                for item_salary_name in item_salary_names:
                    if item_user_id in salaries_by_date[salary_date]:
                        salaries_by_date[salary_date][item_user_id][
                            "salary_data"
                        ].update({item_salary_name: {"amount": 0, "value": 0}})

        for salary in salaries:
            salary_date = salary.date.strftime("%d.%m.%Y")

            salaries_by_date[salary_date][salary.user.id]["salary_data"][salary.name][
                "amount"
            ] += 1
            salaries_by_date[salary_date][salary.user.id]["salary_data"][salary.name][
                "value"
            ] += salary.amount
            salaries_by_date[salary_date][salary.user.id]["value"] += salary.amount

        # print(salaries_by_date)

        # print(set(dates))

        for date in set(dates):
            for user in users:
                # print(user)
                user_id = user["id"]
                if user_taxi[date][user_id] == True:
                    salaries_by_date[date][user_id]["value"] -= 25
                    salaries_by_date[date][user_id]["salary_data"]["Проезд"][
                        "amount"
                    ] -= 1
                    salaries_by_date[date][user_id]["salary_data"]["Проезд"][
                        "value"
                    ] -= 25

        # print(salaries_by_date)

        for bonus_penalty in bonuses_penalties:
            bonus_penalty_date = bonus_penalty.date.strftime("%d.%m.%Y")
            if bonus_penalty_date not in salaries_by_date:
                salaries_by_date[bonus_penalty_date] = {}

            for item in bonus_penalty_names_by_bonus_penalty_date_user_id[
                bonus_penalty_date
            ].items():
                item_user_id = item[0]
                item_bonus_penalty_names = item[1]

                for item_bonus_penalty_name in item_bonus_penalty_names:
                    if item_user_id in salaries_by_date[bonus_penalty_date]:
                        salaries_by_date[bonus_penalty_date][item_user_id][
                            "salary_data"
                        ].update({item_bonus_penalty_name: {"amount": 0, "value": 0}})

        # print(salaries_by_date)
        for bonus_penalty in bonuses_penalties:
            bonus_penalty_date = bonus_penalty.date.strftime("%d.%m.%Y")
            bonus_penalty_users = bonus_penalty.users

            for bonus_penalty_user in bonus_penalty_users.all():
                if bonus_penalty_user.id not in salaries_by_date[bonus_penalty_date]:
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id] = {}
                if (
                    "salary_data"
                    not in salaries_by_date[bonus_penalty_date][bonus_penalty_user.id]
                ):
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "salary_data"
                    ] = {}
                if (
                    "value"
                    not in salaries_by_date[bonus_penalty_date][bonus_penalty_user.id]
                ):
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "value"
                    ] = 0
                if (
                    "first_name"
                    not in salaries_by_date[bonus_penalty_date][bonus_penalty_user.id]
                ):
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "first_name"
                    ] = bonus_penalty_user.first_name
                if (
                    "last_name"
                    not in salaries_by_date[bonus_penalty_date][bonus_penalty_user.id]
                ):
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "last_name"
                    ] = bonus_penalty_user.last_name

                if (
                    bonus_penalty.name
                    not in salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "salary_data"
                    ]
                ):
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "salary_data"
                    ][bonus_penalty.name] = {"amount": 0, "value": 0}
                salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                    "salary_data"
                ][bonus_penalty.name]["amount"] += 1

                if bonus_penalty.type == "bonus":
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "salary_data"
                    ][bonus_penalty.name]["value"] -= bonus_penalty.amount
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "value"
                    ] -= bonus_penalty.amount
                else:
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "salary_data"
                    ][bonus_penalty.name]["value"] += bonus_penalty.amount
                    salaries_by_date[bonus_penalty_date][bonus_penalty_user.id][
                        "value"
                    ] += bonus_penalty.amount

        # print(salaries_by_date)

        body_data_salary = {}
        body_data_salary_tooltip = {}
        body_data_salary_value = {}

        for item in salaries_by_date.items():
            item_date = item[0]

            body_data_salary_tooltip[item_date] = ""
            body_data_salary_value[item_date] = 0

        for item in salaries_by_date.items():
            item_date = item[0]
            item_value = item[1]

            # print(item_value.items())
            # print(item_value.items())

            for item_value_item in item_value.items():
                item_value_item_user_id = item_value_item[0]
                item_value_item_value = item_value_item[1]

                # print(item_value_item_value)

                info = ""
                for item_value_item_value_salary_data_item in item_value_item_value[
                    "salary_data"
                ].items():
                    item_value_item_value_salary_data_item_key = (
                        item_value_item_value_salary_data_item[0]
                    )
                    item_value_item_value_salary_data_item_value = (
                        item_value_item_value_salary_data_item[1]
                    )

                    info += f"{item_value_item_value_salary_data_item_value['value']}р. - {item_value_item_value_salary_data_item_value['amount']} {item_value_item_value_salary_data_item_key}<br />"

                body_data_salary_tooltip[
                    item_date
                ] += f"{item_value_item_value['first_name']} {item_value_item_value['last_name']} - {item_value_item_value['value']}р.<br />{info}<br />"
                body_data_salary_value[item_date] += item_value_item_value["value"]

            salaries_data.append(
                {
                    "date": item_date,
                    "salary": {
                        "tooltip": body_data_salary_tooltip[item_date],
                        "value": body_data_salary_value[item_date],
                    },
                }
            )

        # print('salaries_data', salaries_data)

        expense_for = ["Такси", "Обед"]
        for expense in expenses:
            expense_date = expense.date.strftime("%d.%m.%Y")
            expense_amount = round(expense.amount / len(expense.quests.all()), 2)
            expense_total_amount = expense.amount
            sub_category_latin_name = expense.sub_category.latin_name

            # print(expense_amount)
            # print(expense_total_amount)

            sum_tooltip = ""
            if expense_amount == expense_total_amount:
                sum_tooltip += f"{expense_total_amount}р."
            else:
                sum_tooltip += f"{expense_amount}р. ({expense_total_amount}р.)"

            employees_tooltip = ""
            for employee in expense.employees.all():
                employees_tooltip += f"{employee.first_name} {employee.last_name} "

            if expense.name in expense_for:
                expenses_by_date[expense_date][sub_category_latin_name][
                    "tooltip"
                ] += f"{sum_tooltip} - {expense.name} для {employees_tooltip}<br />"
            else:
                expenses_by_date[expense_date][sub_category_latin_name][
                    "tooltip"
                ] += f"{sum_tooltip} - {expense.name}<br />"
            # expenses_by_date[expense_date][sub_category_latin_name]['value'] += expense_total_amount
            expenses_by_date[expense_date][sub_category_latin_name][
                "value"
            ] += expense_amount

            # print(expenses_by_date)

        for expenses_by_date_item in expenses_by_date.items():
            expenses_data.append(
                {
                    "date": expenses_by_date_item[0],
                    "other_expenses": {
                        "tooltip": expenses_by_date_item[1]["other_expenses"][
                            "tooltip"
                        ],
                        "value": expenses_by_date_item[1]["other_expenses"]["value"],
                    },
                }
            )

        new_obj = {}

        # print(arr_dates)

        for date in arr_dates:
            if date not in new_obj:
                new_obj[date] = {}

            if "salary" not in new_obj[date]:
                new_obj[date]["salary"] = {"tooltip": "", "value": 0}
            if date not in body_data_salary_tooltip:
                body_data_salary_tooltip[date] = ""
            if date not in body_data_salary_value:
                body_data_salary_value[date] = 0

            new_obj[date].update(
                {
                    "salary": {
                        "tooltip": body_data_salary_tooltip[date],
                        "value": body_data_salary_value[date],
                    }
                }
            )

            for sub_category2 in sub_categories2:
                if date not in expenses_by_date:
                    expenses_by_date[date] = {}
                if sub_category2 not in expenses_by_date[date]:
                    expenses_by_date[date][sub_category2] = {"tooltip": "", "value": 0}

                if sub_category2 not in new_obj[date]:
                    new_obj[date][sub_category2] = {"tooltip": "", "value": 0}

                new_obj[date].update(
                    {
                        sub_category2: {
                            "tooltip": expenses_by_date[date][sub_category2]["tooltip"],
                            "value": expenses_by_date[date][sub_category2]["value"],
                        }
                    }
                )

        # print('new_obj', new_obj)

        # print(new_obj)

        new_obj = dict(sorted(new_obj.items()))

        # body_data = salaries_data

        # for sub_category2 in sub_categories2:
        for date, values in new_obj.items():
            item = {"date": date, "salary": values["salary"]}
            for sub_category in sub_categories2:
                if sub_category in values:
                    item[sub_category] = values[sub_category]
                else:
                    item[sub_category] = {"tooltip": "", "value": 0}
            body_data.append(item)

        transformed_data = {
            "head": head,
            "body": body_data,
        }

        return Response(transformed_data)


@api_view(["GET"])
def QuestSalaries(request, id):
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

        salaries = []
        bonuses_penalties = []
        users = []

        salaries = (
            QSalary.objects.filter(quest=Quest.objects.get(id=id))
            .select_related("user")
            .order_by("date")
        )
        bonuses_penalties = (
            STBonusPenalty.objects.filter(quests=Quest.objects.get(id=id))
            .prefetch_related("users")
            .order_by("date")
        )
        users = User.objects.exclude(email="admin@gmail.com")

        if start_date and end_date:
            salaries = salaries.filter(date__range=(start_date, end_date))

        user_data_map = {user.id: UserSerializer(user).data for user in users}

        head_data = [
            {
                "title": user.first_name,
                "dataIndex": str(user.id),
                "key": str(user.id),
            }
            for user in users
        ]

        head_data = sorted(head_data, key=lambda x: x["title"])

        merged_data = {}
        user_taxi = {}

        dates = []

        for salary in salaries:
            date_str = salary.date.strftime("%d.%m.%Y")
            dates.append(date_str)

        dates = list(dict.fromkeys(dates))
        # print(dates)

        for date in dates:
            user_taxi[date] = {}
            for user in users:
                user_taxi[date][user.id] = False

        # print(user_taxi)
        for salary in salaries:
            date_str = salary.date.strftime("%d.%m.%Y")
            item_name = salary.name

            if date_str not in merged_data:
                merged_data[date_str] = {"id": salary.id, "date": date_str}

            for user in users:
                id = user.id
                if id not in merged_data[date_str]:
                    merged_data[date_str][id] = {
                        "value": 0,
                        "tooltip": {},
                    }

            a1 = STExpense.objects.filter(
                Q(name="Такси") & Q(employees=salary.user) & Q(date=salary.date)
            )

            # print(a1)
            if len(a1) != 0:
                user_taxi[date_str][salary.user.id] = True

            # print(user_taxi)

            if salary.user:
                if salary.user.id not in merged_data[date_str]:
                    merged_data[date_str][salary.user.id] = {
                        "value": salary.amount,
                        "tooltip": {
                            item_name: {"count": 1, "total_amount": salary.amount}
                        },
                    }
                else:
                    child = merged_data[date_str][salary.user.id]
                    child["value"] += salary.amount
                    if item_name in child["tooltip"]:
                        child["tooltip"][item_name]["count"] += 1
                        child["tooltip"][item_name]["total_amount"] += salary.amount
                    else:
                        child["tooltip"][item_name] = {
                            "count": 1,
                            "total_amount": salary.amount,
                        }

            # if salary.user:
            #     print(salary.user.id)

        for date in dates:
            # print(dates)
            for user in users:
                # print(user_taxi)
                if user_taxi[date][user.id] == True:
                    merged_data[date][user.id]["value"] -= 25
                    merged_data[date][user.id]["tooltip"]["Проезд"]["count"] -= 1
                    merged_data[date][user.id]["tooltip"]["Проезд"][
                        "total_amount"
                    ] -= 25

        for bp in bonuses_penalties:
            date_str = bp.date.strftime("%d.%m.%Y")
            item_name = bp.name

            if date_str not in merged_data:
                merged_data[date_str] = {"id": bp.id, "date": date_str}

            for user in users:
                id = user.id
                if id not in merged_data[date_str]:
                    merged_data[date_str][id] = {
                        "value": 0,
                        "tooltip": {},
                    }

            if len(bp.users.all()) != 0:
                for bp_user in bp.users.all():
                    if bp.type == "bonus":
                        merged_data[date_str][bp_user.id]["value"] += bp.amount
                        if item_name in merged_data[date_str][bp_user.id]["tooltip"]:
                            merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                "count"
                            ] += 1
                            merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                "total_amount"
                            ] += bp.amount
                        else:
                            merged_data[date_str][bp_user.id]["tooltip"][item_name] = {
                                "count": 1,
                                "total_amount": bp.amount,
                            }
                    elif bp.type == "penalty":
                        merged_data[date_str][bp_user.id]["value"] -= bp.amount
                        if item_name in merged_data[date_str][bp_user.id]["tooltip"]:
                            merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                "count"
                            ] += 1
                            merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                "total_amount"
                            ] -= bp.amount
                        else:
                            merged_data[date_str][bp_user.id]["tooltip"][item_name] = {
                                "count": 1,
                                "total_amount": -bp.amount,
                            }

        body_data = []
        # print(merged_data)
        for date_str, date_data in merged_data.items():
            user_data = {
                "id": date_data["id"],
                "key": str(date_data["id"]),
                "date": date_data["date"],
            }

            for id, data in date_data.items():
                if id not in ("id", "date"):
                    user_data[id] = {
                        "value": data["value"],
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
def VQCashRegisterDeposited(request, id):
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
        cash_register = QCashRegister.objects.filter(
            Q(quest=quest) & Q(operation="plus")
        ).order_by("date")

        if start_date and end_date:
            cash_register = cash_register.filter(date__range=(start_date, end_date))

        serializer = QCashRegisterSerializer(cash_register, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VQCashRegisterTaken(request, id):
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
        cash_register = QCashRegister.objects.filter(
            Q(quest=quest) & Q(operation="minus")
        ).order_by("date")

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
def ToggleQVideo(request, id):
    if request.method == "GET":
        entry = QVideo.objects.get(id=id)

        if entry.sent == True:
            entry.sent = False
        else:
            entry.sent = True

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

        users = []
        salaries = []
        bonuses_penalties = []

        head_data = []

        dates = []
        dates_not_formatted = []

        taxi_expenses = []

        if request.user.is_superuser == True:
            users = User.objects.exclude(email="admin@gmail.com")
            salaries = QSalary.objects.select_related("user").order_by("date")
            bonuses_penalties = STBonusPenalty.objects.prefetch_related(
                "users"
            ).order_by("date")

            objj = {}
            objj["Без квеста"] = {}
            objj["Без квеста"]["children"] = []

            for user in users:
                if user.quest != None:
                    if user.quest.name not in objj:
                        objj[user.quest.name] = {}
                        objj[user.quest.name]["children"] = []

                    objj[user.quest.name]["children"].append(
                        {
                            "title": f"{user.first_name} {user.last_name}",
                            "dataIndex": str(user.id),
                            "key": str(user.id),
                        }
                    )
                elif user.quest == None:
                    objj["Без квеста"]["children"].append(
                        {
                            "title": f"{user.first_name} {user.last_name}",
                            "dataIndex": str(user.id),
                            "key": str(user.id),
                        }
                    )

            for item in objj.items():
                item_quest = item[0]
                item_children = item[1]["children"]

                head_data.append({"title": item_quest, "children": item_children})
        else:
            users = [request.user]
            salaries = (
                QSalary.objects.filter(user=request.user)
                .select_related("user")
                .order_by("date")
            )
            bonuses_penalties = (
                STBonusPenalty.objects.filter(users=request.user)
                .prefetch_related("users")
                .order_by("date")
            )

            head_data = [
                {
                    "title": user.first_name,
                    "dataIndex": str(user.id),
                    "key": str(user.id),
                }
                for user in users
            ]

            head_data = sorted(head_data, key=lambda x: x["title"])

        if start_date and end_date:
            salaries = salaries.filter(date__range=(start_date, end_date))

        for salary in salaries:
            date_str = salary.date.strftime("%d.%m.%Y")
            dates.append(date_str)
            dates_not_formatted.append(salary.date)

        dates = list(dict.fromkeys(dates))
        dates_not_formatted = list(dict.fromkeys(dates_not_formatted))

        user_taxi = {}

        for date in dates:
            user_taxi[date] = {}
            for user in users:
                user_taxi[date][user.id] = 0

        if request.user.is_superuser == True:
            taxi_expenses = STExpense.objects.filter(
                Q(name="Такси") & Q(date__in=dates_not_formatted)
            )
            for t_e in taxi_expenses:
                for employee in t_e.employees.all():
                    user_taxi[t_e.date.strftime("%d.%m.%Y")][employee.id] += 1
        else:
            taxi_expenses = STExpense.objects.filter(
                Q(name="Такси")
                & Q(date__in=dates_not_formatted)
                & Q(employees=request.user)
            )

            for t_e in taxi_expenses:
                user_taxi[t_e.date.strftime("%d.%m.%Y")][request.user.id] += 1

        index_to_move = next(
            (index for index, d in enumerate(head_data) if d["title"] == "Без квеста"),
            None,
        )

        if index_to_move is not None:
            element_to_move = head_data.pop(index_to_move)
            head_data.append(element_to_move)

        merged_data = {}

        for salary in salaries:
            date_str = salary.date.strftime("%d.%m.%Y")
            item_name = salary.name

            if date_str not in merged_data:
                merged_data[date_str] = {"id": salary.id, "date": date_str}

            for user in users:
                id = user.id
                if id not in merged_data[date_str]:
                    merged_data[date_str][id] = {
                        "value": 0,
                        "tooltip": {},
                    }

            if salary.user:
                if salary.user.id not in merged_data[date_str]:
                    merged_data[date_str][salary.user.id] = {
                        "value": salary.amount,
                        "tooltip": {
                            item_name: {"count": 1, "total_amount": salary.amount}
                        },
                    }
                else:
                    child = merged_data[date_str][salary.user.id]
                    child["value"] += salary.amount
                    if item_name in child["tooltip"]:
                        child["tooltip"][item_name]["count"] += 1
                        child["tooltip"][item_name]["total_amount"] += salary.amount
                    else:
                        child["tooltip"][item_name] = {
                            "count": 1,
                            "total_amount": salary.amount,
                        }

        # print(user_taxi)

        for date in dates:
            for user in users:
                # if user_taxi[date][user.id] == True:
                if user_taxi[date][user.id] != 0:
                    merged_data[date][user.id]["value"] -= 25 * int(
                        user_taxi[date][user.id]
                    )

                    if "Проезд" not in merged_data[date][user.id]["tooltip"]:
                        merged_data[date][user.id]["tooltip"]["Проезд"] = {
                            "count": 0,
                            "total_amount": 0,
                        }

                    merged_data[date][user.id]["tooltip"]["Проезд"]["count"] -= int(
                        user_taxi[date][user.id]
                    )
                    merged_data[date][user.id]["tooltip"]["Проезд"][
                        "total_amount"
                    ] -= 25 * int(user_taxi[date][user.id])

                    if merged_data[date][user.id]["tooltip"]["Проезд"]["count"] == 0:
                        merged_data[date][user.id]["tooltip"].pop("Проезд", None)

        for bp in bonuses_penalties:
            date_str = bp.date.strftime("%d.%m.%Y")
            item_name = bp.name

            if date_str not in merged_data:
                merged_data[date_str] = {"id": bp.id, "date": date_str}

            for user in users:
                id = user.id
                if id not in merged_data[date_str]:
                    merged_data[date_str][id] = {
                        "value": 0,
                        "tooltip": {},
                    }

            if len(bp.users.all()) != 0:
                for bp_user in bp.users.all():
                    if bp_user == request.user:
                        if bp.type == "bonus":
                            merged_data[date_str][bp_user.id]["value"] += bp.amount
                            if (
                                item_name
                                in merged_data[date_str][bp_user.id]["tooltip"]
                            ):
                                merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                    "count"
                                ] += 1
                                merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                    "total_amount"
                                ] += bp.amount
                            else:
                                merged_data[date_str][bp_user.id]["tooltip"][
                                    item_name
                                ] = {
                                    "count": 1,
                                    "total_amount": bp.amount,
                                }
                        elif bp.type == "penalty":
                            merged_data[date_str][bp_user.id]["value"] -= bp.amount
                            if (
                                item_name
                                in merged_data[date_str][bp_user.id]["tooltip"]
                            ):
                                merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                    "count"
                                ] += 1
                                merged_data[date_str][bp_user.id]["tooltip"][item_name][
                                    "total_amount"
                                ] -= bp.amount
                            else:
                                merged_data[date_str][bp_user.id]["tooltip"][
                                    item_name
                                ] = {
                                    "count": 1,
                                    "total_amount": -bp.amount,
                                }

        body_data = []

        for date_str, date_data in merged_data.items():
            user_data = {
                "id": date_data["id"],
                "key": str(date_data["id"]),
                "date": date_data["date"],
            }

            for id, data in date_data.items():
                if id not in ("id", "date"):
                    user_data[id] = {
                        "value": data["value"],
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
def Videos(request):
    quests_for_videos = []
    for quest_for_videos in request.user.quests_for_videos.all():
        quests_for_videos.append(quest_for_videos.id)

    qvideos_by_quest_id = QVideo.objects.filter(
        quest__id__in=quests_for_videos
    ).order_by("date")

    body = {}

    for entry in qvideos_by_quest_id:
        date_timestamp = date_to_timestamp(entry.date)
        entry_date = entry.date.strftime("%d.%m.%Y")

        if date_timestamp not in body:
            body[date_timestamp] = {
                "id": 0,
                "key": str(date_timestamp),
                "date_time": entry_date,
                "client_name": "",
                "sent": None,
                "type": "",
                "note": "",
                "quest": {},
                "stquest": {},
                "children": [],
            }

        body[date_timestamp]["children"].append(
            {
                "id": entry.id,
                "key": str(entry.id),
                "date_time": entry.time.strftime("%H:%M"),
                "client_name": entry.client_name,
                "sent": entry.sent,
                "type": entry.type,
                "note": entry.note,
                "quest": {
                    "id": entry.quest.id,
                    "name": entry.quest.name,
                },
                "stquest": {
                    "id": entry.stquest.id,
                    "name": entry.stquest.quest.name,
                },
            }
        )

    for body_data in body.values():
        body_data["children"].sort(key=lambda x: x["date_time"])

    response_data = list(body.values())

    return Response(response_data)


@api_view(["GET"])
def QuestProfitById(request, id):
    if request.method == "GET":
        qincomes = QIncome.objects.filter(quest__id=id)

        total = (
            qincomes.aggregate(
                total=Sum("game") + Sum("room") + Sum("video") + Sum("photomagnets")
            )["total"]
            or 0
        )

        # print(total)
        response_data = {"total": total}

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
def QExpensesFromOwn(request, id):
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
                    "description": None,
                    "who_paid": None,
                    "phone_number_for_transfer": None,
                    "bank": None,
                    "status": None,
                    "quest": None,
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
                    "phone_number_for_transfer": entry.phone_number_for_transfer,
                    "bank": entry.bank,
                    "status": entry.status,
                    "quest": {
                        "id": entry.quest.id,
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

        # print(quest)
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

        entries = QVideo.objects.filter(
            Q(quest__parent_quest=quest) | Q(quest=quest)
        ).order_by("date")

        # print(QVideo.objects.all())

        # for video in QVideo.objects.all():
        # print(video.quest)

        if start_date and end_date:
            entries = entries.filter(date__range=(start_date, end_date))

        keys_to_remove = ["id", "quest_id"]
        response_data = convert_with_children2(entries, keys_to_remove)

        # print(entries)

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
def ToggleQExpensesFromOwn(request, id):
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
        # try:

        data = json.loads(request.data["json"])

        # formatted_date = convert_to_date(data["date"])
        formatted_date = datetime.strptime(
                data["date"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date()
        sub_category = STExpenseSubCategory.objects.get(id=data["sub_category"])
        quests = Quest.objects.filter(name__in=data["quests"])

        expense = STExpense.objects.get(id=id)
        expense.date = formatted_date
        expense.amount = data["amount"]
        expense.name = data["name"]
        # expense.description = data["description"]
        expense.sub_category = sub_category
        expense.paid_from = data["paid_from"]

        if "who_paid" in data:
            # who_paid = User.objects.get(id=data["who_paid"])
            who_paid = User.objects.get(
                Q(first_name=data["who_paid"].split()[0].capitalize())
                & Q(last_name=data["who_paid"].split()[1].capitalize())
            )
            expense.who_paid = who_paid

        if request.FILES:
            expense.attachment = request.FILES["files"]
        else:
            if "files" not in request.data:
                expense.attachment = None

        expense.save()

        if "quests" in data:
            quests = Quest.objects.filter(name__in=data["quests"])
            expense.quests.set(quests)

            cash_register = QCashRegister.objects.filter(stexpense=expense)
            word_card_expense = WorkCardExpense.objects.filter(stexpense=expense)
            expense_from_their = ExpenseFromTheir.objects.filter(stexpense=expense)

            for cash_register_one in cash_register:
                cash_register_one.delete()
            for word_card_expense_one in word_card_expense:
                word_card_expense_one.delete()
            for expense_from_their_one in expense_from_their:
                expense_from_their_one.delete()

            # for quest in quests:
            #     if quest.parent_quest != None:
            #         quest = Quest.objects.get(id=quest.parent_quest.id)

            #     cash_register = QCashRegister.objects.filter()

            for quest in quests:
                if quest.parent_quest != None:
                    quest = Quest.objects.get(id=quest.parent_quest.id)

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
                elif data["paid_from"] == "own":
                    # who_paid = User.objects.get(id=data["who_paid"])
                    local_data = {
                        "date": formatted_date,
                        "amount": int(data["amount"]),
                        "description": data["name"],
                        "who_paid": who_paid,
                        "phone_number_for_transfer": who_paid.phone_number_for_transfer,
                        "bank": who_paid.bank,
                        "quest": quest,
                        "stexpense": expense,
                    }

                    # print(local_data)
                    # print('changed')
                    cash_register = ExpenseFromTheir(**local_data)
                    cash_register.save()

        if "employees" in data:
            employees_names = data["employees"]
            formatted_employees_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in employees_names
            ]
            first_names = [name.split()[0] for name in formatted_employees_names]
            last_names = [name.split()[1] for name in formatted_employees_names]
            employees = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            # employees = User.objects.filter(id__in=data["employees"])
            expense.employees.set(employees)

        return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

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
        data = create_non_empty_dict(request.body)

        quest = Quest.objects.get(name=data["quest"])
        new_quest = quest

        if quest.parent_quest != None:
            quest.address = quest.parent_quest.address
            quest.administrator_rate = quest.parent_quest.administrator_rate
            quest.actor_rate = quest.parent_quest.actor_rate
            quest.animator_rate = quest.parent_quest.animator_rate
            quest.duration_in_minute = quest.parent_quest.duration_in_minute

            new_quest = quest.parent_quest

        entry_data = {
            "quest_cost": data["quest_cost"],
        }

        if "date" in data:
            formatted_date = datetime.strptime(
                data["date"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date()
            entry_data.update({"date": formatted_date})
        if "time" in data:
            formatted_time_without_3_hours = datetime.fromisoformat(
                data["time"].replace("Z", "")
            ).time()
            formatted_time = (
                datetime.combine(datetime.min, formatted_time_without_3_hours)
                + timedelta(hours=3)
            ).time()
            entry_data.update({"time": formatted_time})
        if "quest" in data:
            quest = Quest.objects.get(name=data["quest"])
            if quest.parent_quest != None:
                quest.address = quest.parent_quest.address
                quest.administrator_rate = quest.parent_quest.administrator_rate
                quest.actor_rate = quest.parent_quest.actor_rate
                quest.animator_rate = quest.parent_quest.animator_rate
                quest.duration_in_minute = quest.parent_quest.duration_in_minute
            entry_data.update({"quest": quest})

        administrator_for_entry = None

        count_easy_work = 1

        if "administrator" in data:
            administrator = User.objects.get(
                Q(first_name=data["administrator"].split()[0].capitalize())
                & Q(last_name=data["administrator"].split()[1].capitalize())
            )
            # administrator = User.objects.get(id=data["administrator"])
            administrator_for_entry = administrator
            entry_data.update({"administrator": administrator})
            count_easy_work += 1
        # elif "employees_first_time" in data:
        #     administrator = User.objects.get(id=data['employees_first_time'])

        stquest = STQuest.objects.get(id=id)
        entry = STQuest.objects.get(id=id)
        salaries_by_stquest = QSalary.objects.filter(stquest=stquest)
        incomes_by_stquest = QIncome.objects.filter(stquest=stquest)
        cash_register_by_stquest = QCashRegister.objects.filter(stquest=stquest)
        # videos_by_stquest = QVideo.objects.filter(stquest=stquest)

        for salary_by_stquest in salaries_by_stquest:
            salary_by_stquest.delete()

        for income_by_stquest in incomes_by_stquest:
            income_by_stquest.delete()

        for cash_register_by_stquest_one in cash_register_by_stquest:
            cash_register_by_stquest_one.delete()

        # for video_by_stquest in videos_by_stquest:
        #     video_by_stquest.delete()

        optional_fields = [
            "add_players",
            "actor_or_second_actor_or_animator",
            "discount_sum",
            "discount_desc",
            "room_sum",
            "video",
            "birthday_congr",
            "easy_work",
            "night_game",
            "is_package",
            "is_video_review",
            "video_as_a_gift",
            "cash_payment",
            "cashless_payment",
            "cash_delivery",
            "cashless_delivery",
            "prepayment",
            "room_quantity",
            "video_after",
            "photomagnets_quantity_after",
            "room_sum_after",
            "cash_delivery_after",
            "cash_payment_after",
            "cashless_delivery_after",
            "cashless_payment_after",
        ]

        new_data01 = {}
        new_data02 = {}
        new_data1 = {}
        new_data2 = {}
        new_data3 = {}
        new_data4 = {}

        # if "date" in data:
        #     formatted_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        #     new_data01 = {
        #         "date": formatted_date,
        #     }

        # if "time" in data:
        #     formatted_time_without_3_hours = datetime.fromisoformat(data['time'].replace('Z', '')).time()
        #     formatted_time = (
        #         datetime.combine(datetime.min, formatted_time_without_3_hours)
        #         + timedelta(hours=3)
        #     ).time()
        #     new_data02 = {
        #         "time": formatted_time,
        #     }

        # entry_data = {
        #     "quest": quest,
        #     "date": formatted_date,
        #     "time": formatted_time,
        #     "quest_cost": data["quest_cost"],
        #     "administrator": administrator,
        # }

        if "animator" in data:
            animator = User.objects.get(
                Q(first_name=data["animator"].split()[0].capitalize())
                & Q(last_name=data["animator"].split()[1].capitalize())
            )
            # animator = User.objects.get(id=data["animator"])
            new_data1 = {
                "animator": animator,
            }

            count_easy_work += 1
        else:
            new_data1 = {
                "animator": None,
            }
        if "room_employee_name" in data:
            room_employee_name = User.objects.get(
                Q(first_name=data["room_employee_name"].split()[0].capitalize())
                & Q(last_name=data["room_employee_name"].split()[1].capitalize())
            )
            # room_employee_name = User.objects.get(id=data["room_employee_name"])
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

        if "cash_payment" in data or "cash_delivery" in data:
            create_qcash_register_from_stquest(data, entry)

        if "actors_half" in data:
            # print("hello")
            # actors_half = User.objects.filter(id__in=data["actors_half"])
            actor_half_names = data["actors_half"]
            formatted_actor_half_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in actor_half_names
            ]
            first_names = [name.split()[0] for name in formatted_actor_half_names]
            last_names = [name.split()[1] for name in formatted_actor_half_names]
            actors_half = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            entry.actors_half.set(actors_half)
        else:
            entry.actors_half.set([])

        if len(data["administrators_half"]) != 0:
            administrator_half_names = data["administrators_half"]
            formatted_administrator_half_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in administrator_half_names
            ]
            first_names = [
                name.split()[0] for name in formatted_administrator_half_names
            ]
            last_names = [
                name.split()[1] for name in formatted_administrator_half_names
            ]
            administrators_half = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            # administrators_half = User.objects.filter(
            #     id__in=data["administrators_half"]
            # )
            administrator_for_entry = administrators_half[0]
            entry.administrators_half.set(administrators_half)

        if "actors" in data:
            # actors = User.objects.filter(id__in=data["actors"])
            actor_names = data["actors"]
            formatted_actor_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in actor_names
            ]
            first_names = [name.split()[0] for name in formatted_actor_names]
            last_names = [name.split()[1] for name in formatted_actor_names]
            actors = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            entry.actors.set(actors)
        else:
            entry.actors.set([])

        if "employees_first_time" in data:
            # employees_first_time = User.objects.filter(
            #     id__in=data["employees_first_time"]
            # )
            employee_first_time_names = data["employees_first_time"]
            formatted_employee_first_time_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in employee_first_time_names
            ]
            first_names = [
                name.split()[0] for name in formatted_employee_first_time_names
            ]
            last_names = [
                name.split()[1] for name in formatted_employee_first_time_names
            ]
            employees_first_time = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            entry.employees_first_time.set(employees_first_time)

        create_travel(entry, quest)
        create_qincome(data, entry)

        date_today = date.today()

        administrator_rate = quest.administrator_rate

        if "administrator" in data and administrator.internship_period_start:
            if (
                administrator.internship_period_start
                <= date_today
                <= administrator.internship_period_end
            ) and (administrator.internship_quest == quest):
                administrator_rate = 250

        if (
            (
                ("video" in data and data["video"] != 0)
                or (data["is_video_review"] == True)
                or (data["video_as_a_gift"] == True)
                or ("video_after" in data)
            )
            and ("client_name" in data)
            or (data["is_package"] == True)
        ):

            type = ""
            if data["is_video_review"] == True:
                type = "video_review"
            elif data["is_package"] == True:
                type = "package"
            elif data["video_as_a_gift"] == True:
                type = "video_as_a_gift"
            else:
                type = "video"

            local_quest = quest
            if len(quest.special_versions.all()) != 0:
                local_quest = quest.special_versions.all()[0]

            if len(QVideo.objects.filter(stquest=entry)) == 0:
                QVideo(
                    **{
                        "date": formatted_date,
                        "time": formatted_time,
                        "client_name": data["client_name"],
                        "sent": False,
                        # "is_package": data["is_package"],
                        "type": type,
                        "note": "",
                        "quest": local_quest,
                        "stquest": entry,
                    }
                ).save()
            else:
                for qvideo in QVideo.objects.filter(stquest=entry):
                    qvideo.date = formatted_date
                    qvideo.time = formatted_time
                    qvideo.client_name = data["client_name"]
                    qvideo.type = type
                    qvideo.note = ""
                    qvideo.quest = local_quest
                    qvideo.stquest = entry
                    qvideo.save()

        if "room_employee_name" in data:
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Комната",
                    "user": room_employee_name,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "actor",
                }
            ).save()

        if data["is_video_review"] == True:
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": 50,
                    "name": "Видео отзыв",
                    "user": administrator_for_entry,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "administrator",
                }
            ).save()

        if data["video_as_a_gift"] == True:
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Видео в подарок",
                    "user": administrator_for_entry,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "administrator",
                }
            ).save()

        if "video" in data and data["video"] != 0:
            # print('videoadmin')

            if "administrator" in data:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Сумма видео",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

        if "video_after" in data and data["video_after"] != 0:
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": 200,
                    "name": "Видео после",
                    "user": administrator_for_entry,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "administrator",
                }
            ).save()

        if "animator" in data:
            # animator_local = User.objects.get(id=data["animator"])
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": quest.animator_rate,
                    "name": "Игра",
                    "user": animator,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "actor",
                }
            ).save()

        if len(quest.special_versions.all()) != 0:
            for special_version in quest.special_versions.all():
                if (
                    "administrators_half" in data
                    and len(data["administrators_half"]) != 0
                ):
                    for administrator_half in administrators_half:
                        QSalary(
                            **{
                                "date": formatted_date,
                                "amount": administrator_rate
                                / len(quest.special_versions.all())
                                / 2,
                                "name": f"Игра ({quest.name})",
                                "user": administrators_half,
                                "stquest": entry,
                                "quest": special_version,
                                "sub_category": "administrator",
                            }
                        ).save()
                if "administrator" in data:
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": administrator_rate
                            / len(quest.special_versions.all()),
                            "name": f"Игра ({quest.name})",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": special_version,
                            "sub_category": "administrator",
                        }
                    ).save()
        else:
            if "administrators_half" in data and len(data["administrators_half"]) != 0:
                # print('asdmi213234')
                for administrator_half in administrators_half:
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": administrator_rate / 2,
                            "name": "Игра (50%)",
                            "user": administrator_half,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()
            if "administrator" in data:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": administrator_rate,
                        "name": "Игра",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

        if (
            data["is_package"] == True
            and new_quest.address != "Афанасьева, 13"
            and new_quest.address != "Проспект Ленина, 59"
        ):
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": 30,
                    "name": "Фотомагнит акц.",
                    "user": administrator_for_entry,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "administrator",
                }
            ).save()

        if data["is_package"] == True:
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Видео",
                    "user": administrator_for_entry,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "administrator",
                }
            ).save()
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Бонус за пакет",
                    "user": administrator_for_entry,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "administrator",
                }
            ).save()

        if data["night_game"] != 0:
            if "administrator" in data:
                # administrator = User.objects.get(id=data["administrator"])
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Ночная игра",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()
            if "animator" in data:
                # animator = User.objects.get(id=data["animator"])
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Ночная игра",
                        "user": animator,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                ).save()

        if "actors" in data:
            # actors = User.objects.filter(id__in=data["actors"])
            count_easy_work += actors.count()

            if len(quest.special_versions.all()) != 0:
                for special_version in quest.special_versions.all():
                    for actor in actors:
                        QSalary(
                            **{
                                "date": formatted_date,
                                "amount": quest.actor_rate
                                / len(quest.special_versions.all()),
                                "name": f"Игра ({quest.name})",
                                "user": actor,
                                "stquest": entry,
                                "quest": special_version,
                                "sub_category": "actor",
                            }
                        ).save()

                        if data["night_game"] != 0:
                            QSalary(
                                **{
                                    "date": formatted_date,
                                    "amount": 50,
                                    "name": f"Ночная игра ({quest.name})",
                                    "user": actor,
                                    "stquest": entry,
                                    "quest": special_version,
                                    "sub_category": "actor",
                                }
                            ).save()

                        if data["easy_work"] != 0:
                            QSalary(
                                **{
                                    "date": formatted_date,
                                    "amount": int(data["easy_work"])
                                    / 2
                                    / count_easy_work,
                                    "name": f"Простой ({quest.name})",
                                    "user": actor,
                                    "stquest": entry,
                                    "quest": special_version,
                                    "sub_category": "actor",
                                }
                            ).save()
            else:
                for actor in actors:
                    if data["night_game"] != 0:
                        QSalary(
                            **{
                                "date": formatted_date,
                                "amount": 100,
                                "name": "Ночная игра",
                                "user": actor,
                                "stquest": entry,
                                "quest": new_quest,
                                "sub_category": "actor",
                            }
                        ).save()
                    if data["easy_work"] != 0:
                        QSalary(
                            **{
                                "date": formatted_date,
                                "amount": int(data["easy_work"]) / count_easy_work,
                                "name": "Простой",
                                "user": actor,
                                "stquest": entry,
                                "quest": new_quest,
                                "sub_category": "actor",
                            }
                        ).save()
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": quest.actor_rate,
                            "name": "Игра",
                            "user": actor,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                    ).save()

        if "actors_half" in data:
            # actors_half = User.objects.filter(id__in=data["actors_half"])
            for actor_half in actors_half:
                if data["night_game"] != 0:
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 100,
                            "name": "Ночная игра",
                            "user": actor_half,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                    ).save()
                if data["easy_work"] != 0:
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": int(data["easy_work"]) / count_easy_work,
                            "name": "Простой",
                            "user": actor_half,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                    ).save()
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": quest.actor_rate / 2,
                        "name": "Игра (50%)",
                        "user": actor_half,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                ).save()

        if "photomagnets_quantity" in data and data["photomagnets_quantity"] != 0:
            photomagnets_promo = data["photomagnets_quantity"] // 2
            photomagnets_not_promo = data["photomagnets_quantity"] - photomagnets_promo

            for i in range(photomagnets_not_promo):
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 60,
                        "name": "Фотомагнит (не акц.)",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

            for i in range(photomagnets_promo):
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 30,
                        "name": "Фотомагнит (акц.)",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

        if "photomagnets_quantity_after" in data and (
            int(data["photomagnets_quantity_after"]) != 0
        ):
            photomagnets_promo = int(data["photomagnets_quantity_after"]) // 2
            photomagnets_not_promo = (
                int(data["photomagnets_quantity_after"]) - photomagnets_promo
            )

            for i in range(photomagnets_not_promo):
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 60,
                        "name": "Фотомагнит (не акц.)",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

            for i in range(photomagnets_promo):
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 30,
                        "name": "Фотомагнит (акц.)",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

        if data["easy_work"] != 0:
            QSalary(
                **{
                    "date": formatted_date,
                    "amount": int(data["easy_work"]) / count_easy_work,
                    "name": "Простой",
                    "user": administrator_for_entry,
                    "stquest": entry,
                    "quest": new_quest,
                    "sub_category": "actor",
                }
            ).save()

        if "employees_first_time" in data:
            employees_first_time = User.objects.filter(
                id__in=data["employees_first_time"]
            )

            for employee_first_time in employees_first_time:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 250,
                        "name": "Игра (в первый раз)",
                        "user": employee_first_time,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                ).save()

        return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = STQuest.objects.get(id=id)
        entry.delete()

        return Response(status=200)


@api_view(["GET"])
def VSTQuestSaveAll(request):
    if request.method == "GET":
        # stquests = STQuest.objects.all()
        # for stquest in stquests:
        #     print(stquest)

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

            formatted_date = datetime.strptime(
                data["date"], "%Y-%m-%dT%H:%M:%S.%fZ"
            ).date()
            # user = User.objects.get(id=data["user"])
            users_names = data["users"]
            formatted_users_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in users_names
            ]
            first_names = [name.split()[0] for name in formatted_users_names]
            last_names = [name.split()[1] for name in formatted_users_names]
            users = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            quests = Quest.objects.filter(name__in=data["quests"])

            entry = STBonusPenalty.objects.get(id=id)
            entry.date = formatted_date
            # entry.user = user
            entry.amount = data["amount"]
            entry.name = data["name"]
            entry.type = data["type"]
            entry.save()
            entry.users.set(users)
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
            entry.latin_name = data["latin_name"]
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

            entry = STExpenseSubCategory.objects.get(id=id)
            entry.name = data["name"]
            entry.latin_name = data["latin_name"]
            entry.category = STExpenseCategory.objects.get(id=data["category"])
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
        data = create_non_empty_dict(request.body)

        optional_fields = ["phone_number", "phone_number_for_transfer", "bank"]

        entry_data = {
            "email": data["email"],
            "last_name": data["last_name"],
            "first_name": data["first_name"],
            "middle_name": data["middle_name"],
            "password": data["password"],
            "is_active": data["is_active"],
        }

        if "date_of_birth" in data:
            entry_data["date_of_birth"] = convert_to_date(data["date_of_birth"])

        if "quest" in data:
            entry_data["quest"] = Quest.objects.get(name=data["quest"])

        if "internship_period" in data:
            entry_data["internship_period_start"] = convert_to_date(
                data["internship_period"][0]
            )
            entry_data["internship_period_end"] = convert_to_date(
                data["internship_period"][1]
            )

        if "internship_quest" in data:
            entry_data["internship_quest"] = Quest.objects.get(
                id=data["internship_quest"]
            )

        for field in optional_fields:
            if field in data:
                entry_data[field] = data[field]

        entry = User.objects.create_user(**entry_data)

        if "roles" in data:
            entry.roles.set(Role.objects.filter(id__in=data["roles"]))

        if "quests_for_videos" in data:
            entry.quests_for_videos.set(
                Quest.objects.filter(id__in=data["quests_for_videos"])
            )

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
#             # quests = Quest.objects.filter(name__in=data["quests"])

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
            "cost_weekdays_with_package": data["cost_weekdays_with_package"],
            "cost_weekends_with_package": data["cost_weekends_with_package"],
            "duration_in_minute": data["duration_in_minute"],
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
                "cost_weekdays": data["cost_weekdays"],
                "cost_weekends": data["cost_weekends"],
            }

            entry = QuestVersion(**entry_data)
            entry.save()

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


import base64
from django.core.files import File


@api_view(["POST"])
def CreateSTExpense(request):
    if request.method == "POST":
        # try:
        data = json.loads(request.data["json"])

        formatted_date = convert_to_date(data["date"])
        # formatted_date = datetime.strptime(data["date"], '%Y-%m-%d').date()
        sub_category = STExpenseSubCategory.objects.get(id=data["sub_category"])

        # stexpenses = STExpense.objects.filter(
        #     Q(date=formatted_date) & Q(quests=Quest.objects.filter(name__in=data["quests"])) & Q(employees=User.objects.filter(id__in=data["employees"])) & Q(name=data["name"]) & Q(amount=data["amount"])
        # )

        # if len(stexpenses) != 0:
        #     return JsonResponse({"message": "Запись уже создана"}, status=400)

        expense_data = {
            "date": formatted_date,
            "amount": data["amount"],
            "name": data["name"],
            # "description": data["description"],
            "sub_category": sub_category,
            "paid_from": data["paid_from"],
            "created_by": request.user,
        }

        if "who_paid" in data:
            who_paid = User.objects.get(
                Q(first_name=data["who_paid"].split()[0].capitalize())
                & Q(last_name=data["who_paid"].split()[1].capitalize())
            )
            expense_data.update({"who_paid": who_paid})

        expense = STExpense(**expense_data)

        if request.FILES:
            expense.attachment = request.FILES["files"]

        expense.save()

        if "quests" in data:
            quests = Quest.objects.filter(name__in=data["quests"])
            expense.quests.set(quests)

            for quest in quests:
                if quest.parent_quest != None:
                    quest = Quest.objects.get(id=quest.parent_quest.id)

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
                elif data["paid_from"] == "own":
                    # who_paid = User.objects.get(id=data["who_paid"])
                    local_data = {
                        "date": formatted_date,
                        "amount": int(data["amount"]),
                        "description": data["name"],
                        "who_paid": who_paid,
                        "phone_number_for_transfer": who_paid.phone_number_for_transfer,
                        "bank": who_paid.bank,
                        "quest": quest,
                        "stexpense": expense,
                    }

                    # print('created')
                    cash_register = ExpenseFromTheir(**local_data)
                    cash_register.save()

        if "employees" in data:
            # employees = User.objects.filter(id__in=data["employees"])
            employees_names = data["employees"]
            formatted_employees_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in employees_names
            ]
            first_names = [name.split()[0] for name in formatted_employees_names]
            last_names = [name.split()[1] for name in formatted_employees_names]
            employees = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            expense.employees.set(employees)

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
        data = create_non_empty_dict(request.body)

        # print(data)

        formatted_date = convert_to_date(data["date"])

        # print(formatted_date)
        # formatted_date = datetime.strptime(data["date"], '%Y-%m-%d').date()
        formatted_time_without_3_hours = datetime.fromisoformat(
            data["time"].replace("Z", "")
        ).time()
        formatted_time = (
            datetime.combine(datetime.min, formatted_time_without_3_hours)
            + timedelta(hours=3)
        ).time()
        # quest = Quest.objects.get(name=data["quest"])
        quest = Quest.objects.get(name=data["quest"])
        new_quest = quest

        if quest.parent_quest != None:
            quest.address = quest.parent_quest.address
            quest.administrator_rate = quest.parent_quest.administrator_rate
            quest.actor_rate = quest.parent_quest.actor_rate
            quest.animator_rate = quest.parent_quest.animator_rate
            quest.duration_in_minute = quest.parent_quest.duration_in_minute

            new_quest = quest.parent_quest

        stquests = STQuest.objects.filter(
            Q(date=formatted_date) & Q(time=formatted_time) & Q(quest=quest)
        )

        count_easy_work = 1

        optional_fields = [
            "add_players",
            "actor_or_second_actor_or_animator",
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
            "video_as_a_gift",
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
            # "administrator": administrator,
            "created_by": request.user,
        }

        if "animator" in data:
            count_easy_work += 1
            animator = User.objects.get(
                Q(first_name=data["animator"].split()[0].capitalize())
                & Q(last_name=data["animator"].split()[1].capitalize())
            )

            # animator = User.objects.get(id=data["animator"])
            entry_data["animator"] = animator

            # entry_data["animator"] = data['animator']

            # count_easy_work += 1

        administrator_for_entry = None

        if "administrator" in data:
            administrator = User.objects.get(
                Q(first_name=data["administrator"].split()[0].capitalize())
                & Q(last_name=data["administrator"].split()[1].capitalize())
            )
            # administrator = User.objects.get(id=data["administrator"])
            administrator_for_entry = administrator
            entry_data["administrator"] = administrator

            count_easy_work += 1

        if "room_employee_name" in data:
            room_employee_name = User.objects.get(
                Q(first_name=data["room_employee_name"].split()[0].capitalize())
                & Q(last_name=data["room_employee_name"].split()[1].capitalize())
            )
            # room_employee_name = User.objects.get(id=data["room_employee_name"])
            entry_data["room_employee_name"] = room_employee_name
        if ("photomagnets_quantity" in data) and (quest.address != "Афанасьева, 13"):
            entry_data["photomagnets_quantity"] = int(data["photomagnets_quantity"])

        for field in optional_fields:
            if field in data:
                entry_data[field] = data[field]

        entry = STQuest(**entry_data)

        date_today = date.today()

        administrator_rate = quest.administrator_rate

        if len(stquests) == 0:
            if administrator.internship_period_start:
                # print('period')
                if (
                    administrator.internship_period_start
                    <= date_today
                    <= administrator.internship_period_end
                ) and (administrator.internship_quest == quest):
                    administrator_rate = 250

            entry.save()

            if "actors" in data:
                actor_names = data["actors"]
                formatted_actor_names = [
                    " ".join(word.capitalize() for word in name.split())
                    for name in actor_names
                ]
                first_names = [name.split()[0] for name in formatted_actor_names]
                last_names = [name.split()[1] for name in formatted_actor_names]
                actors = User.objects.filter(
                    first_name__in=first_names, last_name__in=last_names
                )
                # actors = User.objects.filter(id__in=data["actors"])
                entry.actors.set(actors)
            if "actors_half" in data:
                actor_half_names = data["actors_half"]
                formatted_actor_half_names = [
                    " ".join(word.capitalize() for word in name.split())
                    for name in actor_half_names
                ]
                first_names = [name.split()[0] for name in formatted_actor_half_names]
                last_names = [name.split()[1] for name in formatted_actor_half_names]
                actors_half = User.objects.filter(
                    first_name__in=first_names, last_name__in=last_names
                )
                # actors_half = User.objects.filter(id__in=data["actors_half"])
                entry.actors_half.set(actors_half)

            if "administrators_half" in data:
                administrator_half_names = data["administrators_half"]
                formatted_administrator_half_names = [
                    " ".join(word.capitalize() for word in name.split())
                    for name in administrator_half_names
                ]
                first_names = [
                    name.split()[0] for name in formatted_administrator_half_names
                ]
                last_names = [
                    name.split()[1] for name in formatted_administrator_half_names
                ]
                administrators_half = User.objects.filter(
                    first_name__in=first_names, last_name__in=last_names
                )
                # administrators_half = User.objects.filter(
                #     id__in=data["administrators_half"]
                # )
                administrator_for_entry = administrators_half[0]
                entry.administrators_half.set(administrators_half)

            if "employees_first_time" in data:
                employee_first_time_names = data["employees_first_time"]
                formatted_employee_first_time_names = [
                    " ".join(word.capitalize() for word in name.split())
                    for name in employee_first_time_names
                ]
                first_names = [
                    name.split()[0] for name in formatted_employee_first_time_names
                ]
                last_names = [
                    name.split()[1] for name in formatted_employee_first_time_names
                ]
                employees_first_time = User.objects.filter(
                    first_name__in=first_names, last_name__in=last_names
                )
                # employees_first_time = User.objects.filter(
                #     id__in=data["employees_first_time"]
                # )
                entry.employees_first_time.set(employees_first_time)

            create_travel(entry, quest)
            create_qincome(data, entry)

            if "room_employee_name" in data:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Комната",
                        "user": room_employee_name,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                ).save()

            if "cash_payment" in data or "cash_delivery" in data:
                create_qcash_register_from_stquest(data, entry)

            if data["is_video_review"] == True:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 50,
                        "name": "Видео отзыв",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

            if data["video_as_a_gift"] == True:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Видео в подарок",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

            if "video" in data and data["video"] != 0:
                if "administrator" in data:
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 100,
                            "name": "Сумма видео",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()

            if "video_after" in data and data["video_after"] != 0:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 200,
                        "name": "Видео после",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

            if "internship_quest" in data:
                employees = User.objects.filter(id__in=data["internship_quest"])
                for employee in employees:
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 250,
                            "name": "Игра",
                            "user": employee,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                    ).save()

            if (
                (
                    ("video" in data and data["video"] != 0)
                    or (data["is_video_review"] == True)
                    or (data["video_as_a_gift"] == True)
                    or ("video_after" in data)
                )
                and ("client_name" in data)
                or (data["is_package"] == True)
            ):
                type = ""
                if data["is_video_review"] == True:
                    type = "video_review"
                elif data["is_package"] == True:
                    type = "package"
                elif data["video_as_a_gift"] == True:
                    type = "video_as_a_gift"
                else:
                    type = "video"

                local_quest = quest
                if len(quest.special_versions.all()) != 0:
                    local_quest = quest.special_versions.all()[0]

                # print(local_quest)
                QVideo(
                    **{
                        "date": formatted_date,
                        "time": formatted_time,
                        "client_name": data["client_name"],
                        "sent": False,
                        # "is_package": data["is_package"],
                        "type": type,
                        "note": "",
                        "quest": local_quest,
                        "stquest": entry,
                    }
                ).save()

            if "animator" in data:
                # animator_local = User.objects.get(id=data["animator"])
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": quest.animator_rate,
                        "name": "Игра",
                        "user": animator,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                ).save()

            if len(quest.special_versions.all()) != 0:
                for special_version in quest.special_versions.all():
                    if (
                        "administrators_half" in data
                        and len(data["administrators_half"]) != 0
                    ):
                        for administrator_half in administrators_half:
                            QSalary(
                                **{
                                    "date": formatted_date,
                                    "amount": administrator_rate
                                    / len(quest.special_versions.all())
                                    / 2,
                                    "name": f"Игра ({quest.name})",
                                    "user": administrator_half,
                                    "stquest": entry,
                                    "quest": special_version,
                                    "sub_category": "administrator",
                                }
                            ).save()
                    if "administrator" in data:
                        QSalary(
                            **{
                                "date": formatted_date,
                                "amount": administrator_rate
                                / len(quest.special_versions.all()),
                                "name": f"Игра ({quest.name})",
                                "user": administrator_for_entry,
                                "stquest": entry,
                                "quest": special_version,
                                "sub_category": "administrator",
                            }
                        ).save()
            else:
                if (
                    "administrators_half" in data
                    and len(data["administrators_half"]) != 0
                ):
                    for administrator_half in administrators_half:
                        QSalary(
                            **{
                                "date": formatted_date,
                                "amount": administrator_rate / 2,
                                "name": "Игра (50%)",
                                "user": administrator_half,
                                "stquest": entry,
                                "quest": new_quest,
                                "sub_category": "administrator",
                            }
                        ).save()
                if "administrator" in data:
                    print("adminsda232")
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": administrator_rate,
                            "name": "Игра",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()

            if data["is_package"] == True:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Видео за пакет",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Бонус за пакет",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()

                if (
                    new_quest.address != "Афанасьева, 13"
                    and new_quest.address != "Проспект Ленина, 59"
                ):
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 30,
                            "name": "Фотомагнит акц.",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()

            if data["night_game"] != 0:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": 100,
                        "name": "Ночная игра",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "administrator",
                    }
                ).save()
                if "animator" in data:
                    # animator = User.objects.get(id=data["animator"])
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 100,
                            "name": "Ночная игра",
                            "user": animator,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                    ).save()

            if "actors" in data:
                count_easy_work += actors.count()

                for actor in actors:
                    if data["night_game"] != 0:
                        night_game_salary_data = {
                            "date": formatted_date,
                            "amount": 100,
                            "name": "Ночная игра",
                            "user": actor,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                        QSalary(**night_game_salary_data).save()

                    if data["easy_work"] != 0:
                        easy_work_salary_data = {
                            "date": formatted_date,
                            # "amount": (int(data["easy_work"]) - 50) / count_easy_work,
                            "amount": int(data["easy_work"]) / count_easy_work,
                            "name": "Простой",
                            "user": actor,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                        QSalary(**easy_work_salary_data).save()

                    game_salary_data = {
                        "date": formatted_date,
                        "amount": quest.actor_rate,
                        "name": "Игра",
                        "user": actor,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                    QSalary(**game_salary_data).save()
                    # STExpense(**{
                    #     "date": formatted_date,
                    #     "amount": quest.actor_rate,
                    #     "name": "Игра",
                    #     "user": actor,
                    #     "stquest": entry,
                    #     "quest": quest,
                    #     "sub_category": STExpenseSubCategory.objects.get(latin_name='salary')
                    # }).quests.add(quest).save()

            if "photomagnets_quantity" in data and data["photomagnets_quantity"] != 0:
                photomagnets_promo = data["photomagnets_quantity"] // 2
                photomagnets_not_promo = (
                    data["photomagnets_quantity"] - photomagnets_promo
                )

                for i in range(photomagnets_not_promo):
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 60,
                            "name": "Фотомагнит (не акц.)",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()

                for i in range(photomagnets_promo):
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 30,
                            "name": "Фотомагнит (акц.)",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()

            if "photomagnets_quantity_after" in data and (
                int(data["photomagnets_quantity_after"]) != 0
            ):
                photomagnets_promo = int(data["photomagnets_quantity_after"]) // 2
                photomagnets_not_promo = (
                    int(data["photomagnets_quantity_after"]) - photomagnets_promo
                )

                for i in range(photomagnets_not_promo):
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 60,
                            "name": "Фотомагнит (не акц.)",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()

                for i in range(photomagnets_promo):
                    QSalary(
                        **{
                            "date": formatted_date,
                            "amount": 30,
                            "name": "Фотомагнит (акц.)",
                            "user": administrator_for_entry,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "administrator",
                        }
                    ).save()

            if "actors_half" in data:
                count_easy_work += actors.count()

                for actor_half in actors_half:
                    if data["night_game"] != 0:
                        night_game_salary_data = {
                            "date": formatted_date,
                            "amount": 100,
                            "name": "Ночная игра",
                            "user": actor_half,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                        QSalary(**night_game_salary_data).save()

                    if data["easy_work"] != 0:
                        easy_work_salary_data = {
                            "date": formatted_date,
                            "amount": int(data["easy_work"]) / count_easy_work,
                            "name": "Простой",
                            "user": actor_half,
                            "stquest": entry,
                            "quest": new_quest,
                            "sub_category": "actor",
                        }
                        QSalary(**easy_work_salary_data).save()

                    game_salary_data = {
                        "date": formatted_date,
                        "amount": quest.actor_rate / 2,
                        "name": "Игра",
                        "user": actor_half,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                    QSalary(**game_salary_data).save()

            if data["easy_work"] != 0:
                QSalary(
                    **{
                        "date": formatted_date,
                        "amount": int(data["easy_work"]) / count_easy_work,
                        "name": "Простой",
                        "user": administrator_for_entry,
                        "stquest": entry,
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                ).save()

            return JsonResponse({"message": "Запись успешно создана"}, status=201)
        else:
            return JsonResponse({"message": "Запись уже создана"}, status=400)
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

        formatted_date = datetime.strptime(data["date"], "%Y-%m-%dT%H:%M:%S.%fZ").date()
        # user = User.objects.get(id=data["user"])

        optional_fields = ["name"]

        entry_data = {
            "date": formatted_date,
            "amount": data["amount"],
            "type": data["type"],
            # "user": user,
        }

        for field in optional_fields:
            if field in data:
                entry_data[field] = data[field]

        entry = STBonusPenalty(**entry_data)
        entry.save()

        if "users" in data:
            users_names = data["users"]
            formatted_users_names = [
                " ".join(word.capitalize() for word in name.split())
                for name in users_names
            ]
            first_names = [name.split()[0] for name in formatted_users_names]
            last_names = [name.split()[1] for name in formatted_users_names]
            users = User.objects.filter(
                first_name__in=first_names, last_name__in=last_names
            )
            entry.users.set(users)
        if "quests" in data:
            quests = Quest.objects.filter(name__in=data["quests"])
            entry.quests.set(quests)

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTExpenseCategory(request):
    if request.method == "POST":
        # try:
        data = json.loads(request.body)
        # print(data)

        entry_data = {
            "name": data["name"],
            "latin_name": data["latin_name"],
        }

        entry = STExpenseCategory(**entry_data)
        entry.save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        # return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTExpenseSubCategory(request):
    if request.method == "POST":
        # try:
        data = json.loads(request.body)

        entry_data = {
            "name": data["name"],
            "latin_name": data["latin_name"],
            "category": STExpenseCategory.objects.get(id=data["category"]),
        }

        entry = STExpenseSubCategory(**entry_data)
        entry.save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateQCashRegister(request):
    if request.method == "POST":
        # try:
        data = create_non_empty_dict(request.body)

        if data["operation"] == "minus":
            data["amount"] = -int(data["amount"])

        entry_data = {
            "date": convert_to_date(data["date"]),
            "amount": data["amount"],
            "description": data["description"],
            "operation": data["operation"],
            "quest": Quest.objects.get(id=data["quest"]),
        }

        entry = QCashRegister(**entry_data)
        entry.save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)
