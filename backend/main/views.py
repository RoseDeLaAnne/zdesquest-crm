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

from .serializers import *
from .models import *

from .utils import create_qincome


# GET
@api_view(["GET"])
def VUsers(request):
    if request.method == "GET":
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VUsersByRole(request, rname):
    if request.method == "GET":
        role = Role.objects.get(latin_name=rname)
        users = User.objects.filter(roles=role)
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VRoles(request):
    if request.method == "GET":
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VQuests(request):
    if request.method == "GET":
        quests = Quest.objects.all()
        serializer = QuestSerializer(quests, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VTransactions(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        transactions = Transaction.objects.all().order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                transactions = transactions.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        serializer = TransactionSerializer(transactions, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VSTQuests(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        stquests = STQuest.objects.all().order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                stquests = stquests.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        serializer = STQuestSerializer(stquests, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VExpenses(request):
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
def VBonusesPenalties(request):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        bonuses_penalties = STBonusPenalty.objects.all().order_by("date")

        if start_date_param and end_date_param:
            try:
                start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
                end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

                bonuses_penalties = bonuses_penalties.filter(
                    date__range=(start_date, end_date)
                )
            except ValueError:
                return Response(
                    {
                        "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
                    },
                    status=400,
                )

        serializer = STBonusPenaltySerializer(bonuses_penalties, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def VExpenseCategories(request):
    if request.method == "GET":
        categories = STExpenseCategory.objects.all()
        serializer = STExpenseCategorySerializer(categories, many=True)

        return Response(serializer.data)


@api_view(["GET"])
def VExpenseSubCategories(request):
    if request.method == "GET":
        sub_categories = STExpenseSubCategory.objects.all()
        serializer = STExpenseSubCategorySerializer(sub_categories, many=True)

        return Response(serializer.data)


# GET, PUT, DELETE
@api_view(["GET", "PUT", "DELETE"])
def VUser(request, uid):
    if request.method == "GET":
        user = User.objects.get(id=uid)
        serializer = UserSerializer(user, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            quest = Quest.objects.get(id=data["quest"])
            roles = Role.objects.filter(id__in=data["roles"])

            user = User.objects.get(id=uid)
            user.username = data["username"]
            user.last_name = data["last_name"]
            user.first_name = data["first_name"]
            user.middle_name = data["middle_name"]
            user.quest = quest

            if "password" in data:
                user.set_password(data["password"])

            user.save()
            user.roles.set(roles)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        user = User.objects.get(id=uid)
        user.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VRole(request, rid):
    if request.method == "GET":
        role = Role.objects.get(id=rid)
        serializer = RoleSerializer(role, many=False)

        return Response(serializer.data)

    # if request.method == "PUT":
    #     try:
    #         data = json.loads(request.body)

    #         formatted_date = datetime.fromisoformat(data["date"]).date()
    #         sub_category = ExpenseSubCategory.objects.get(id=data["subCategory"])
    #         quests = Quest.objects.filter(id__in=data["quests"])

    #         expense = Expense.objects.get(id=rid)
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
        role = Role.objects.get(id=rid)
        role.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VQuest(request, qname):
    if request.method == "GET":
        quest = Quest.objects.get(latin_name=qname)
        serializer = QuestSerializer(quest, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            quest = Quest.objects.get(latin_name=qname)
            quest.latin_name = data["latin_name"]
            quest.name = data["name"]
            quest.address = data["address"]
            quest.rate = data["rate"]
            quest.save()

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        quest = Quest.objects.get(latin_name=qname)
        quest.delete()

        return Response(status=200)


@api_view(["GET"])
def VQuestIncomes(request, qname):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        quest = Quest.objects.get(latin_name=qname)
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
def VQuestExpenses(request, qname):
    if request.method == "GET":
        start_date_param = request.query_params.get("start_date", None)
        end_date_param = request.query_params.get("end_date", None)

        quest = Quest.objects.get(latin_name=qname)
        expenses = STExpense.objects.filter(quests=quest).order_by("date")

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
def VQuestSalaries(request, qname):
    if request.method == "GET":
        quest = Quest.objects.get(latin_name=qname)
        salaries = QSalary.objects.filter(user__quest=quest).order_by("date")

        merged_data = {}

        for transaction in salaries:
            date_str = transaction.date.strftime("%d.%m.%Y")
            item_name = transaction.name

            if date_str not in merged_data:
                merged_data[date_str] = {
                    "id": transaction.id,
                    "key": transaction.id,
                    "date": date_str,
                    "children": [],
                }

            found = False
            for child in merged_data[date_str]["children"]:
                if child["user"]["id"] == transaction.user.id:
                    child["sum"] += transaction.amount
                    child["tooltip"] = f"{child['sum']}р. - {item_name}"
                    found = True
                    break

            if not found:
                user_data = {
                    "user": UserSerializer(transaction.user).data,
                    "sum": transaction.amount,
                    "tooltip": f"{transaction.amount}р. - {item_name}",
                }

                merged_data[date_str]["children"].append(user_data)

        # Convert merged_data dictionary to the desired format
        body_data = list(merged_data.values())

        # Create the head data (user titles)
        head_data = [
            {
                "title": user_data["user"]["username"],
                "dataIndex": user_data["user"]["username"],
                "key": user_data["user"]["username"],
            }
            for date_data in body_data
            for user_data in date_data["children"]
        ]

        transformed_data = {"head": head_data, "body": body_data}

        return Response(transformed_data)
        # start_date_param = request.query_params.get("start_date", None)
        # end_date_param = request.query_params.get("end_date", None)

        # quest = Quest.objects.get(latin_name=qname)
        # salaries = QSalary.objects.filter(user__quest=quest).order_by("date")

        # if start_date_param and end_date_param:
        #     try:
        #         start_date = datetime.strptime(start_date_param, "%d-%m-%Y").date()
        #         end_date = datetime.strptime(end_date_param, "%d-%m-%Y").date()

        #         salaries = salaries.filter(date__range=(start_date, end_date))
        #     except ValueError:
        #         return Response(
        #             {
        #                 "error": "Неверный формат даты. Пожалуйста, используйте ДД-ММ-ГГГГ."
        #             },
        #             status=400,
        #         )

        # serializer = QSalarySerializer(salaries, many=True)
        # return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
def VTransaction(request, tid):
    if request.method == "GET":
        transaction = Transaction.objects.get(id=tid)
        serializer = TransactionSerializer(transaction, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()

            transaction = Transaction.objects.get(id=tid)
            transaction.date = formatted_date
            transaction.amount = data["amount"]
            transaction.status = data["status"]
            transaction.save()

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        transaction = Transaction.objects.get(id=tid)
        transaction.delete()

        return JsonResponse({"message": "Запись успешно удалена"}, status=200)


@api_view(["GET", "PUT", "DELETE"])
def VExpense(request, eid):
    if request.method == "GET":
        expense = STExpense.objects.get(id=eid)
        serializer = STExpenseSerializer(expense, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            sub_category = STExpenseSubCategory.objects.get(id=data["subCategory"])
            quests = Quest.objects.filter(id__in=data["quests"])

            expense = STExpense.objects.get(id=eid)
            expense.date = formatted_date
            expense.amount = data["amount"]
            expense.name = data["name"]
            expense.sub_category = sub_category
            expense.save()
            expense.quests.set(quests)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        expense = STExpense.objects.get(id=eid)
        expense.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VSTQuest(request, stqid):
    if request.method == "GET":
        stquest = STQuest.objects.get(id=stqid)
        serializer = STQuestSerializer(stquest, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        # try:
        data = json.loads(request.body)

        formatted_date = datetime.fromisoformat(data["date"]).date()
        formatted_time = datetime.fromisoformat(data["time"]).time()
        quest = Quest.objects.get(id=data["quest"])
        administrator = User.objects.get(id=data["administrator"])
        animator = User.objects.get(id=data["animator"])
        actors = User.objects.filter(id__in=data["actor"])
        room_employee_name = User.objects.get(id=data["room_employee_name"])

        stquest_data = {
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
        }

        stquest = STQuest.objects.get(id=stqid)
        for key, value in stquest_data.items():
            setattr(stquest, key, value)
        stquest.save()
        stquest.actor.set(actors)

        return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        stquest = STQuest.objects.get(id=stqid)
        stquest.delete()

        return Response(status=200)


@api_view(["GET", "PUT", "DELETE"])
def VBonusPenalty(request, bpid):
    if request.method == "GET":
        bonus_penalty = STBonusPenalty.objects.get(id=bpid)
        serializer = STBonusPenaltySerializer(bonus_penalty, many=False)

        return Response(serializer.data)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            user = User.objects.get(id=data["user"])
            quests = Quest.objects.filter(id__in=data["quests"])

            bonus_penalty = STBonusPenalty.objects.get(id=bpid)
            bonus_penalty.date = formatted_date
            bonus_penalty.user = user
            bonus_penalty.bonus = data["bonus"]
            bonus_penalty.penalty = data["penalty"]
            bonus_penalty.save()
            bonus_penalty.quests.set(quests)

            return JsonResponse({"message": "Запись успешно обновлена"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        bonus_penalty = STBonusPenalty.objects.get(id=bpid)
        bonus_penalty.delete()

        return Response(status=200)


# POST
@api_view(["POST"])
def VCreateUser(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            quest = Quest.objects.get(id=data["quest"])
            roles = Role.objects.filter(id__in=data["roles"])

            optional_fields = ["first_name", "last_name", "middle_name"]

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
def VCreateRole(request):
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
def VCreateQuest(request):
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
def VCreateTransaction(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()

            transaction_data = {
                "date": formatted_date,
                "amount": data["amount"],
            }

            transaction = Transaction(**transaction_data)
            transaction.save()

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def VCreateExpense(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            sub_category = STExpenseSubCategory.objects.get(id=data["subCategory"])
            quests = Quest.objects.filter(id__in=data["quests"])

            expense_data = {
                "date": formatted_date,
                "amount": data["amount"],
                "name": data["name"],
                "sub_category": sub_category,
            }

            expense = STExpense(**expense_data)
            expense.save()
            expense.quests.set(quests)

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def VCreateSTQuest(request):
    if request.method == "POST":
        # try:
        data = json.loads(request.body)

        formatted_date = datetime.fromisoformat(data["date"]).date()
        formatted_time = datetime.fromisoformat(data["time"]).time()
        quest = Quest.objects.get(id=data["quest"])
        administrator = User.objects.get(id=data["administrator"])
        animator = User.objects.get(id=data["animator"])
        actors = User.objects.filter(id__in=data["actor"])
        room_employee_name = User.objects.get(id=data["room_employee_name"])

        stquest_data = {
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
        }

        stquest = STQuest(**stquest_data)
        # stquest.save()
        # stquest.actor.set(actors)

        # create_qincome(data)
        
        for actor in actors:
            game_salary_data = {
                "date": formatted_date,
                "amount": quest.rate,
                "name": 'Игра',
                "user": actor,
            }
            QSalary(**game_salary_data).save()

            if (data['video']):
                video_salary_data = {
                    "date": formatted_date,
                    "amount": 100,
                    "name": 'Видео',
                    "user": actor,
                }
                QSalary(**video_salary_data).save()

        return JsonResponse({"message": "Запись успешно создана"}, status=201)

        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)


@api_view(["POST"])
def VCreateBonusPenalty(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            formatted_date = datetime.fromisoformat(data["date"]).date()
            user = User.objects.get(id=data["user"])
            quests = Quest.objects.filter(id__in=data["quests"])

            bonus_penalty_data = {
                "date": formatted_date,
                "user": user,
                "bonus": data["bonus"],
                "penalty": data["penalty"],
            }

            bonus_penalty = STBonusPenalty(**bonus_penalty_data)
            bonus_penalty.save()
            bonus_penalty.quests.set(quests)

            return JsonResponse({"message": "Запись успешно создана"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Разрешены только POST-запросы"}, status=405)
