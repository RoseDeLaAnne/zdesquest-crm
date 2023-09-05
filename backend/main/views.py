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

from .utils import create_qincome


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

        serializer = STQuestSerializer(entries, many=True)

        return Response(serializer.data)


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
def STBonuses(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        entries = STBonus.objects.all().order_by("date")

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

        serializer = STBonusSerializer(entries, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def STPenalties(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        entries = STPenalty.objects.all().order_by("date")

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

        serializer = STPenaltySerializer(entries, many=True)
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

        serializer = QIncomeSerializer(incomes, many=True)
        return Response(serializer.data)


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

        # Get the Quest object
        quest = Quest.objects.get(latin_name=name)

        # Filter expenses based on Quest
        entries = STExpense.objects.filter(quests=quest).order_by("date")

        # Apply date range filter
        if start_date and end_date:
            entries = entries.filter(date__range=(start_date, end_date))

        # Get all sub-categories
        sub_categories = STExpenseSubCategory.objects.all()

        # Prepare sub-category info
        sub_category_info = {
            sub_category.latin_name: {
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
            sub_category = entry.sub_category.latin_name
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
                "dataIndex": sub_category.latin_name,
                "key": sub_category.latin_name,
            }
            category_data["children"].append(sub_category_data)

        # Populate transformed data
        id_counter = 1
        for date, sub_category_data in aggregated_data.items():
            row = {"date": date, "id": id_counter, "key": str(id_counter)}
            id_counter += 1

            # Initialize all sub-categories to 0 in the row
            for sub_category in sub_categories:
                row[sub_category.latin_name] = 0

            for sub_category, amount in sub_category_data.items():
                row[sub_category] = amount
            row["total"] = sum(sub_category_data.values())
            transformed_data["body"].append(row)

        # Return the transformed data as a response
        return Response(transformed_data)


@api_view(["GET"])
def VCashRegister(request, name):
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

        cash_register = QCashRegister.objects.all().order_by("date")

        if start_date and end_date:
            cash_register = cash_register.filter(date__range=(start_date, end_date))

        serializer = QCashRegisterSerializer(cash_register, many=True)

        return Response(serializer.data)


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
def WorkCardExpenses(request):
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

        work_card_expenses = WorkCardExpense.objects.all().order_by("date")

        if start_date and end_date:
            work_card_expenses = work_card_expenses.filter(date__range=(start_date, end_date))

        serializer = WorkCardExpenseSerializer(work_card_expenses, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def ExpensesFromTheir(request):
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

        expenses_from_their = ExpenseFromTheir.objects.all().order_by("date")

        if start_date and end_date:
            expenses_from_their = expenses_from_their.filter(date__range=(start_date, end_date))

        serializer = ExpenseFromTheirSerializer(expenses_from_their, many=True)

        return Response(serializer.data)


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
def VSTBonus(request, id):
    if request.method == "GET":
        bonus = STBonus.objects.get(id=id)
        serializer = STBonusSerializer(bonus, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            user = User.objects.get(id=data["user"])
            quests = Quest.objects.filter(name__in=data["quests"])

            entry = STBonus.objects.get(id=id)
            entry.date = formatted_date
            entry.user = user
            entry.amount = data["amount"]
            entry.name = data["name"]
            entry.save()
            entry.quests.set(quests)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = STBonus.objects.get(id=id)
        entry.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VSTPenalty(request, id):
    if request.method == "GET":
        entry = STPenalty.objects.get(id=id)
        serializer = STPenaltySerializer(entry, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            user = User.objects.get(id=data["user"])
            quests = Quest.objects.filter(name__in=data["quests"])

            entry = STPenalty.objects.get(id=id)
            entry.date = formatted_date
            entry.user = user
            entry.amount = data["amount"]
            entry.name = data["name"]
            entry.save()
            entry.quests.set(quests)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        entry = STPenalty.objects.get(id=id)
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


@api_view(["POST"])
def CreateRole(request):
    if request.method == "POST":
        try:
            # data = json.loads(request.body)

            # formatted_date = datetime.fromisoformat(data["date"]).date()
            # sub_category = ExpenseSubCategory.objects.get(id=data["subCategory"])
            # quests = Quest.objects.filter(id__in=data["quests"])

            # expense_data = {
            #     "date": formatted_date,
            #     "amount": data["amount"],
            #     "name": data["name"],
            #     "sub_category": sub_category,
            # }

            # expense = Expense(**expense_data)
            # expense.save()
            # expense.quests.set(quests)

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


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


# @api_view(["POST"])
# def CreateTransaction(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             formatted_date = datetime.fromisoformat(data["date"]).date()

#             transaction_data = {
#                 "date": formatted_date,
#                 "amount": data["amount"],
#             }

#             transaction = Transaction(**transaction_data)
#             transaction.save()

#             return JsonResponse({"message": "Запись успешно создана"}, status=201)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)

#     else:
#         return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


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
            "who_paid_amount": data["who_paid_amount"],
            # "image": request.data['image'][0]
        }

        expense = STExpense(**expense_data)
        expense.save()
        expense.quests.set(quests)

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

        optional_fields = ["add_players", "actor_second_actor", "discount_sum", "discount_desc", "room_sum", "room_quantity", "video", "birthday_congr", "easy_work", "night_game", "package", "travel", "cash_payment", "cashless_payment", "cash_delivery", "cashless_delivery", "prepayment"]

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
        if (actors):
            entry.actors.set(actors)

        # create_qincome(data, entry.id)

        # stquest = STQuest.objects.get(id=entry.id)

        # for actor in actors:
        #     game_salary_data = {
        #         "date": formatted_date,
        #         "amount": quest.actor_rate,
        #         "name": "Игра",
        #         "user": actor,
        #         "stquest": stquest,
        #     }
        #     QSalary(**game_salary_data).save()

        #     if data["video"]:
        #         video_salary_data = {
        #             "date": formatted_date,
        #             "amount": 100,
        #             "name": "Видео",
        #             "user": actor,
        #             "stquest": stquest,
        #         }
        #         QSalary(**video_salary_data).save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTBonus(request):
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
                "user": user,
            }

            entry = STBonus(**entry_data)
            entry.save()
            entry.quests.set(quests)

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def CreateSTPenalty(request):
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
                "user": user,
            }

            entry = STPenalty(**entry_data)
            entry.save()
            entry.quests.set(quests)

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

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
