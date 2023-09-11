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

from .utils import (
    create_qincome,
    create_qcash_register_from_stquest,
    create_qcash_register_from_stexpense,
)


# GET
@api_view(["GET"])
def Users(request):
    if request.method == "GET":
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)


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
                    "package": False,
                    "travel": False,
                    "cash_payment": 0,
                    "cashless_payment": 0,
                    "cash_delivery": 0,
                    "cashless_delivery": 0,
                    "prepayment": 0,
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
                "id": entry.room_employee_name.id,
                "last_name": entry.room_employee_name.last_name,
                "first_name": entry.room_employee_name.first_name,
            }

            entry_dict[date_timestamp]["video"] += entry.video
            entry_dict[date_timestamp][
                "photomagnets_quantity"
            ] += entry.photomagnets_quantity
            entry_dict[date_timestamp]["photomagnets_sum"] += entry.photomagnets_sum
            entry_dict[date_timestamp][
                "photomagnets_quantity"
            ] += entry.photomagnets_quantity
            entry_dict[date_timestamp]["birthday_congr"] += entry.birthday_congr
            entry_dict[date_timestamp]["easy_work"] += entry.easy_work
            entry_dict[date_timestamp]["night_game"] += entry.night_game
            entry_dict[date_timestamp]["administrator"] = {
                "id": entry.administrator.id,
                "last_name": entry.administrator.last_name,
                "first_name": entry.administrator.first_name,
            }
            entry_dict[date_timestamp]["actors"] = serialized_actors
            entry_dict[date_timestamp]["actors_half"] = serialized_half_actors
            entry_dict[date_timestamp]["animator"] = {
                "id": entry.animator.id,
                "last_name": entry.animator.last_name,
                "first_name": entry.animator.first_name,
            }
            entry_dict[date_timestamp]["package"] = entry.package
            entry_dict[date_timestamp]["travel"] = entry.travel
            entry_dict[date_timestamp]["cash_payment"] += entry.cash_payment
            entry_dict[date_timestamp]["cashless_payment"] += entry.cashless_payment
            entry_dict[date_timestamp]["cash_delivery"] += entry.cash_delivery
            entry_dict[date_timestamp]["cashless_delivery"] += entry.cashless_delivery
            entry_dict[date_timestamp]["prepayment"] += entry.prepayment

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
                        "id": entry.room_employee_name.id,
                        "last_name": entry.room_employee_name.last_name,
                        "first_name": entry.room_employee_name.first_name,
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
                    },
                    "actors": serialized_actors,
                    "actors_half": serialized_half_actors,
                    "animator": {
                        "id": entry.animator.id,
                        "last_name": entry.animator.last_name,
                        "first_name": entry.animator.first_name,
                    },
                    "package": entry.package,
                    "travel": entry.travel,
                    "cash_payment": entry.cash_payment,
                    "cashless_payment": entry.cashless_payment,
                    "cash_delivery": entry.cash_delivery,
                    "cashless_delivery": entry.cashless_delivery,
                    "prepayment": entry.prepayment,
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


# @api_view(["GET"])
# def STBonuses(request):
#     if request.method == "GET":
#         start_date_param = request.query_params.get("start_date", None)
#         end_date_param = request.query_params.get("end_date", None)

#         entries = STBonus.objects.all().order_by("date")

#         if start_date_param and end_date_param:
#             try:
#                 start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
#                 end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

#                 entries = entries.filter(date__range=(start_date, end_date))
#             except ValueError:
#                 return Response(
#                     {
#                         "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
#                     },
#                     status=400,
#                 )

#         serializer = STBonusSerializer(entries, many=True)
#         return Response(serializer.data)


# @api_view(["GET"])
# def STBonuses(request):
#     if request.method == "GET":
#         start_date_param = request.query_params.get("start_date", None)
#         end_date_param = request.query_params.get("end_date", None)

#         entries = STBonus.objects.all().order_by("date")

#         if start_date_param and end_date_param:
#             try:
#                 start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
#                 end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

#                 entries = entries.filter(date__range=(start_date, end_date))
#             except ValueError:
#                 return Response(
#                     {
#                         "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
#                     },
#                     status=400,
#                 )

#         serializer = STBonusSerializer(entries, many=True)
#         return Response(serializer.data)


# @api_view(["GET"])
# def STPenalties(request):
#     if request.method == "GET":
#         start_date_param = request.query_params.get("start_date", None)
#         end_date_param = request.query_params.get("end_date", None)

#         entries = STPenalty.objects.all().order_by("date")

#         if start_date_param and end_date_param:
#             try:
#                 start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
#                 end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

#                 entries = entries.filter(date__range=(start_date, end_date))
#             except ValueError:
#                 return Response(
#                     {
#                         "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
#                     },
#                     status=400,
#                 )

#         serializer = STPenaltySerializer(entries, many=True)
#         return Response(serializer.data)


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
        try:
            data = json.loads(request.body)

            quest = Quest.objects.get(id=data["quest"])
            roles = Role.objects.filter(id__in=data["roles"])

            user = User.objects.get(id=id)
            user.username = data["username"]
            user.last_name = data["last_name"]
            user.first_name = data["first_name"]
            # user.middle_name = data["middle_name"]
            user.quest = quest

            if "password" in data:
                user.set_password(data["password"])

            user.save()
            user.roles.set(roles)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

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

    #         formatted_date = datetime.fromisoformat(data["date"]).date()
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
        quest = Quest.objects.get(id=id)
        serializer = QuestSerializer(quest, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            quest = Quest.objects.get(id=id)
            quest.latin_name = data["latin_name"]
            quest.name = data["name"]
            quest.address = data["address"]
            quest.rate = data["rate"]
            quest.save()

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        quest = Quest.objects.get(id=id)
        quest.delete()

        return Response(status=200)


from datetime import datetime


def date_to_timestamp(date):
    return int(datetime(date.year, date.month, date.day).timestamp())


@api_view(["GET"])
def QuestIncomes(request, name):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        quest = Quest.objects.get(latin_name=name)
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
def QuestExpenses(request, name):
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

        quest = Quest.objects.get(latin_name=name)
        entries = STExpense.objects.filter(quests=quest).order_by("date")

        if start_date and end_date:
            entries = entries.filter(date__range=(start_date, end_date))

        serializer = STExpenseSerializer(entries, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VQCashRegister(request, name):
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

        quest = Quest.objects.get(latin_name=name)
        print(quest)
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
def QWorkCardExpenses(request, name):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        quest = Quest.objects.get(latin_name=name)

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
def QExpensesFromTheir(request, name):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        quest = Quest.objects.get(latin_name=name)

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

#             formatted_date = datetime.fromisoformat(data["date"]).date()

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
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            sub_category = STExpenseSubCategory.objects.get(name=data["sub_category"])
            # whooplatil = User.objects.get(id=data["whooplatil"])
            quests = Quest.objects.filter(name__in=data["quests"])

            expense = STExpense.objects.get(id=id)
            expense.date = formatted_date
            expense.amount = data["amount"]
            expense.name = data["name"]
            expense.sub_category = sub_category
            # expense.whooplatil = whooplatil
            # expense.oplacheno = data["oplacheno"]
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
        data = json.loads(request.body)

        formatted_date = datetime.fromisoformat(data["date"]).date()
        formatted_time = datetime.fromisoformat(data["time"]).time()
        quest = Quest.objects.get(id=data["quest"])
        administrator = User.objects.get(id=data["administrator"])
        animator = User.objects.get(id=data["animator"])
        actors = User.objects.filter(id__in=data["actors"])
        room_employee_name = User.objects.get(id=data["room_employee_name"])

        entry_data = {
            "quest": quest,
            "date": formatted_date,
            "time": formatted_time,
            "quest_cost": data["quest_cost"],
            "add_players": data["add_players"],
            "actor_second_actor": data["actor_second_actor"],
            "discount_sum": data["discount_sum"],
            "discount_desc": data["discount_desc"],
            "room_sum": data["room_sum"],
            "room_quantity": data["room_quantity"],
            "room_employee_name": room_employee_name,
            "video": data["video"],
            "birthday_congr": data["birthday_congr"],
            "photomagnets_quantity": int(data["photomagnets_quantity"]),
            "easy_work": data["easy_work"],
            "night_game": data["night_game"],
            "administrator": administrator,
            "animator": animator,
            "package": data["package"],
            "travel": data["travel"],
            # "opl_nal": data["opl_nal"],
            # "opl_beznal": data["opl_beznal"],
            # "sdach_nal": data["sdach_nal"],
            # "sdach_beznal": data["sdach_beznal"],
            # "predoplata": data["predoplata"],
        }

        entry = STQuest.objects.get(id=id)
        for key, value in entry_data.items():
            setattr(entry, key, value)
        entry.save()
        entry.actors.set(actors)

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

            formatted_date = datetime.fromisoformat(data["date"]).date()
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


# @api_view(["GET", "PUT", "DELETE"])
# def VSTBonus(request, id):
#     if request.method == "GET":
#         bonus = STBonus.objects.get(id=id)
#         serializer = STBonusSerializer(bonus, many=False)

#         return Response(serializer.data)

#     if request.method == "PUT":
#         try:
#             data = json.loads(request.body)

#             formatted_date = datetime.fromisoformat(data["date"]).date()
#             user = User.objects.get(id=data["user"])
#             quests = Quest.objects.filter(name__in=data["quests"])

#             entry = STBonus.objects.get(id=id)
#             entry.date = formatted_date
#             entry.user = user
#             entry.amount = data["amount"]
#             entry.name = data["name"]
#             entry.save()
#             entry.quests.set(quests)

#             return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     if request.method == "DELETE":
#         entry = STBonus.objects.get(id=id)
#         entry.delete()

#         return Response(status=200)


# @api_view(["GET", "PUT", "DELETE"])
# def VSTPenalty(request, id):
#     if request.method == "GET":
#         entry = STPenalty.objects.get(id=id)
#         serializer = STPenaltySerializer(entry, many=False)

#         return Response(serializer.data)

#     if request.method == "PUT":
#         try:
#             data = json.loads(request.body)

#             formatted_date = datetime.fromisoformat(data["date"]).date()
#             user = User.objects.get(id=data["user"])
#             quests = Quest.objects.filter(name__in=data["quests"])

#             entry = STPenalty.objects.get(id=id)
#             entry.date = formatted_date
#             entry.user = user
#             entry.amount = data["amount"]
#             entry.name = data["name"]
#             entry.save()
#             entry.quests.set(quests)

#             return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     if request.method == "DELETE":
#         entry = STPenalty.objects.get(id=id)
#         entry.delete()

#         return Response(status=200)


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
        try:
            data = json.loads(request.body)

            quest = Quest.objects.get(id=data["quest"])
            roles = Role.objects.filter(id__in=data["roles"])

            optional_fields = ["first_name", "last_name"]

            user_data = {
                "username": data["username"],
                "password": data["password"],
                "quest": quest,
            }

            for field in optional_fields:
                if field in data:
                    user_data[field] = data[field]

            user = User.objects.create_user(**user_data)
            user.roles.set(roles)

            return JsonResponse({"message": "Пользователь успешно создан"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


# @api_view(["POST"])
# def CreateRole(request):
#     if request.method == "POST":
#         try:
#             # data = json.loads(request.body)

#             # formatted_date = datetime.fromisoformat(data["date"]).date()
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
        try:
            data = json.loads(request.body)

            quest_data = {
                "latin_name": data["latin_name"],
                "name": data["name"],
                "address": data["address"],
                "rate": data["rate"],
            }

            quest = Quest(**quest_data)
            quest.save()

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTExpense(request):
    if request.method == "POST":
        # try:
        data = json.loads(request.body)

        formatted_date = datetime.fromisoformat(data["date"]).date()
        sub_category = STExpenseSubCategory.objects.get(name=data["sub_category"])
        who_paid = User.objects.get(id=data["who_paid"])
        quests = Quest.objects.filter(name__in=data["quests"])

        expense_data = {
            "date": formatted_date,
            "amount": data["amount"],
            "name": data["name"],
            "sub_category": sub_category,
            "who_paid": who_paid,
            # "who_paid_amount": data["who_paid_amount"],
            # "image": request.data['image'][0]
        }

        expense = STExpense(**expense_data)
        expense.save()
        expense.quests.set(quests)

        print(expense)

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
            elif data["paid_from"] == "their":
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
def CreateSTQuest(request):
    if request.method == "POST":
        # try:
        data = json.loads(request.body)

        formatted_date = datetime.fromisoformat(data["date"]).date()
        formatted_time = datetime.fromisoformat(data["time"]).time()
        quest = Quest.objects.get(id=data["quest"])
        administrator = User.objects.get(id=data["administrator"])
        animator = User.objects.get(id=data["animator"])
        actors = User.objects.filter(id__in=data["actors"])
        room_employee_name = User.objects.get(id=data["room_employee_name"])

        # def flatten_list(input_list):
        #     flattened_list = []
        #     for item in input_list:
        #         if isinstance(item, list):
        #             flattened_list.extend(flatten_list(item))
        #         else:
        #             flattened_list.append(item)
        #     return flattened_list

        # data = [
        #     administrator, animator, actors
        # ]

        # flattened_list = flatten_list(data)

        # # Now, flattened_list contains the flattened elements
        # print(flattened_list)

        count_easy_work = actors.count() + 2

        optional_fields = [
            "add_players",
            "actor_second_actor",
            "discount_sum",
            "discount_desc",
            "room_sum",
            "room_quantity",
            "video",
            "birthday_congr",
            "easy_work",
            "night_game",
            "package",
            "travel",
            "cash_payment",
            "cashless_payment",
            "cash_delivery",
            "cashless_delivery",
            "prepayment",
        ]

        entry_data = {
            "quest": quest,
            "date": formatted_date,
            "time": formatted_time,
            "quest_cost": data["quest_cost"],
            "room_employee_name": room_employee_name,
            "photomagnets_quantity": int(data["photomagnets_quantity"]),
            "administrator": administrator,
            "animator": animator,
        }

        for field in optional_fields:
            if field in data:
                entry_data[field] = data[field]

        entry = STQuest(**entry_data)
        entry.save()

        stquests = STQuest.objects.all()
        print(stquests)

        prev_time = None  # Initialize a variable to track the previous time
        prev_address = None  # Initialize a variable to track the previous address

        for idx, stq in enumerate(stquests):
            prep = 30
            clean = 15
            quest_duration = int(stq.quest.duration_minute)
            initial_datetime = datetime.combine(datetime.today(), stq.time)
            new_datetime = (
                initial_datetime
                + timedelta(minutes=quest_duration)
                + timedelta(minutes=clean)
            )
            new_time = new_datetime.time()

            if prev_address is not None and stq.quest.address != prev_address:
                print("travel (addresses not equal)")

                for _ in range(3):
                    travel_data_administrator = {
                        "date": formatted_date,
                        "amount": 25,
                        "name": "Проезд",
                        "user": administrator,
                        "stquest": stq,
                    }
                    QSalary(**travel_data_administrator).save()
                    travel_data_animator = {
                        "date": formatted_date,
                        "amount": 25,
                        "name": "Проезд",
                        "user": animator,
                        "stquest": stq,
                    }
                    QSalary(**travel_data_animator).save()

            prev_address = stq.quest.address  # Update the previous address

            if prev_time is not None:
                # Calculate the time difference in hours only
                time_difference_hours = (
                    initial_datetime - prev_time
                ).total_seconds() / 3600

                if (
                    time_difference_hours >= 2
                ):  # Check if the time difference is greater than or equal to 2 hours
                    print("travel (time difference >= 2 hours)")

                    for _ in range(4):
                        travel_data_administrator = {
                            "date": formatted_date,
                            "amount": 25,
                            "name": "Проезд",
                            "user": administrator,
                            "stquest": stq,
                        }
                        QSalary(**travel_data_administrator).save()
                        travel_data_animator = {
                            "date": formatted_date,
                            "amount": 25,
                            "name": "Проезд",
                            "user": animator,
                            "stquest": stq,
                        }
                        QSalary(**travel_data_animator).save()

            prev_time = new_datetime  # Update the previous time to the new time

            if idx % 2 == 0:
                print(new_time.strftime("%H:%M:%S"))
            else:
                print("Odd Index:", stq.time)

        # prev_time = None  # Initialize a variable to track the previous time

        # for idx, stq in enumerate(stquests):
        #     prep = 30
        #     clean = 15
        #     quest_duration = int(stq.quest.duration_minute)
        #     initial_datetime = datetime.combine(datetime.today(), stq.time)
        #     new_datetime = initial_datetime + timedelta(minutes=quest_duration) + timedelta(minutes=clean)
        #     new_time = new_datetime.time()

        #     if prev_time is not None:
        #         # Calculate the time difference in hours only
        #         time_difference_hours = (initial_datetime - prev_time).total_seconds() / 3600

        #         if time_difference_hours >= 2:  # Check if the time difference is more than 1 hour
        #             print('travel')

        #             travel_data_administrator = {
        #                 "date": formatted_date,
        #                 "amount": 25,
        #                 "name": "Проезд",
        #                 "user": administrator,
        #                 "stquest": stq,
        #             }
        #             QSalary(**travel_data_administrator).save()
        #             travel_data_animator = {
        #                 "date": formatted_date,
        #                 "amount": 25,
        #                 "name": "Проезд",
        #                 "user": animator,
        #                 "stquest": stq,
        #             }
        #             QSalary(**travel_data_animator).save()

        #             # for actor in stq.actors:
        #             #     travel_data_actor = {
        #             #         "date": formatted_date,
        #             #         "amount": 25,
        #             #         "name": "Проезд",
        #             #         "user": actor,
        #             #         "stquest": stq,
        #             #     }
        #             #     QSalary(**travel_data_actor).save()

        #     prev_time = initial_datetime  # Update the previous time

        #     if idx % 2 == 0:
        #         print(new_time.strftime("%H:%M:%S"))
        #     else:
        #         print("Odd Index:", stq.time)

        #     # # Create a datetime object with today's date and the initial_time
        #     # initial_datetime = datetime.combine(datetime.today(), initial_time)

        #     # # Perform the addition with timedelta
        #     # new_datetime = initial_datetime + timedelta(minutes=quest_duration) + timedelta(minutes=clean)

        #     # new_time = new_datetime.time()  # Extract the time portion from the datetime

        #     # print(new_time.strftime("%H:%M:%S"))

        if actors:
            entry.actors.set(actors)

        create_qincome(data, entry.id)
        create_qcash_register_from_stquest(data, entry.id)

        stquest = STQuest.objects.get(id=entry.id)

        if data["video"]:
            video_salary_data_administrator = {
                "date": formatted_date,
                "amount": 100,
                "name": "Видео",
                "user": administrator,
                "stquest": stquest,
            }
            QSalary(**video_salary_data_administrator).save()
            package_bonus_salary_data_administrator = {
                "date": formatted_date,
                "amount": 100,
                "name": "Бонус за пакет",
                "user": administrator,
                "stquest": stquest,
            }
            QSalary(**package_bonus_salary_data_administrator).save()
            photomagnet_promo_salary_data_administrator = {
                "date": formatted_date,
                "amount": 30,
                "name": "Фотомагнит акц.",
                "user": administrator,
                "stquest": stquest,
            }
            QSalary(**photomagnet_promo_salary_data_administrator).save()

        if data["night_game"]:
            night_game_salary_data_administrator = {
                "date": formatted_date,
                "amount": 100,
                "name": "Ночная игра",
                "user": administrator,
                "stquest": stquest,
            }
            QSalary(**night_game_salary_data_administrator).save()
            night_game_salary_data_animator = {
                "date": formatted_date,
                "amount": 100,
                "name": "Ночная игра",
                "user": animator,
                "stquest": stquest,
            }
            QSalary(**night_game_salary_data_animator).save()

        easy_work_salary_data_administrator = {
            "date": formatted_date,
            "amount": int(data["easy_work"]) / count_easy_work,
            "name": "Простой",
            "user": administrator,
            "stquest": stquest,
        }
        QSalary(**easy_work_salary_data_administrator).save()

        easy_work_salary_data_animator = {
            "date": formatted_date,
            "amount": int(data["easy_work"]) / count_easy_work,
            "name": "Простой",
            "user": animator,
            "stquest": stquest,
        }
        QSalary(**easy_work_salary_data_animator).save()

        for actor in actors:
            if data["night_game"]:
                night_game_salary_data = {
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Ночная игра",
                    "user": actor,
                    "stquest": stquest,
                }
                QSalary(**night_game_salary_data).save()

            easy_work_salary_data = {
                "date": formatted_date,
                "amount": int(data["easy_work"]) / count_easy_work,
                "name": "Простой",
                "user": actor,
                "stquest": stquest,
            }
            QSalary(**easy_work_salary_data).save()

            game_salary_data = {
                "date": formatted_date,
                "amount": quest.actor_rate,
                "name": "Игра",
                "user": actor,
                "stquest": stquest,
            }
            QSalary(**game_salary_data).save()

            if data["video"]:
                video_salary_data = {
                    "date": formatted_date,
                    "amount": 100,
                    "name": "Видео",
                    "user": actor,
                    "stquest": stquest,
                }
                QSalary(**video_salary_data).save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTBonusPenalty(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            user = User.objects.get(id=data["user"])
            quests = Quest.objects.filter(id__in=data["quests"])

            entry_data = {
                "date": formatted_date,
                "amount": data["amount"],
                "name": data["name"],
                "type": data["type"],
                "user": user,
            }

            entry = STBonusPenalty(**entry_data)
            entry.save()
            entry.quests.set(quests)

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


# @api_view(["POST"])
# def CreateSTBonus(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             formatted_date = datetime.fromisoformat(data["date"]).date()
#             user = User.objects.get(id=data["user"])
#             quests = Quest.objects.filter(id__in=data["quests"])

#             entry_data = {
#                 "date": formatted_date,
#                 "amount": data["amount"],
#                 "name": data["name"],
#                 "user": user,
#             }

#             entry = STBonus(**entry_data)
#             entry.save()
#             entry.quests.set(quests)

#             return JsonResponse({"message": "Запись успешно создана"}, status=201)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     else:
#         return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


# @api_view(["POST"])
# def CreateSTPenalty(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             formatted_date = datetime.fromisoformat(data["date"]).date()
#             user = User.objects.get(id=data["user"])
#             quests = Quest.objects.filter(id__in=data["quests"])

#             entry_data = {
#                 "date": formatted_date,
#                 "amount": data["amount"],
#                 "name": data["name"],
#                 "user": user,
#             }

#             entry = STPenalty(**entry_data)
#             entry.save()
#             entry.quests.set(quests)

#             return JsonResponse({"message": "Запись успешно создана"}, status=201)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     else:
#         return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


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
