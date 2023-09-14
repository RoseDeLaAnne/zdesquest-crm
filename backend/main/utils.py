from datetime import datetime, timedelta

from django.db.models import Q

from .models import *


def create_qincome(data, stquest_id):
    formatted_date = datetime.fromisoformat(data["date"]).date()
    formatted_time = datetime.fromisoformat(data["time"]).time()

    stquest = STQuest.objects.get(id=stquest_id)
    quest = Quest.objects.get(id=data["quest"])

    photomagnets_promo = int(data["photomagnets_quantity"]) // 2
    photomagnets_not_promo = int(data["photomagnets_quantity"]) - photomagnets_promo
    photomagnets_sum = photomagnets_not_promo * 250 + photomagnets_promo * 150

    # optional_fields = ["paid_cash", "paid_non_cash"]

    local_data = {
        "date": formatted_date,
        "time": formatted_time,
        "game": int(data["quest_cost"])
        + int(data["add_players"])
        + int(data["easy_work"])
        + int(data["night_game"])
        - int(data["discount_sum"]),
        "room": int(data["room_sum"]),
        "video": int(data["video"]),
        "photomagnets": int(photomagnets_sum),
        "actor": int(data["actor_second_actor"]),
        "stquest": stquest,
        "quest": quest,
        "paid_cash": int(data["cash_payment"]) - int(data["cash_delivery"]),
        "paid_non_cash": int(data["prepayment"])
        + int(data["cashless_payment"])
        - int(data["cashless_delivery"]),
    }

    # for field in optional_fields:
    #         if field in data:
    #             local_data[field] = data[field]

    qincome = QIncome(**local_data)
    qincome.save()


def create_qcash_register_from_stquest(data, stquest_id):
    formatted_date = datetime.fromisoformat(data["date"]).date()

    stquest = STQuest.objects.get(id=stquest_id)

    local_data = {
        "date": formatted_date,
        "amount": int(data["cash_payment"]) - int(data["cash_delivery"]),
        "stquest": stquest,
        "quest": stquest.quest,
    }

    cash_register = QCashRegister(**local_data)
    cash_register.save()


def create_qcash_register_from_stexpense(data, stexpense_id):
    formatted_date = datetime.fromisoformat(data["date"]).date()

    stexpense = STExpense.objects.get(id=stexpense_id)

    local_data = {
        "date": formatted_date,
        "amount": -int(data["amount"]),
        "description": data["name"],
        "stexpense": stexpense,
    }

    cash_register = QCashRegister(**local_data)
    cash_register.save()


def create_travel(entry):
    stquest_date = entry.date
    salaries_to_delete = QSalary.objects.filter(Q(name="Проезд") & Q(date=stquest_date))
    salaries_to_delete.delete()
    prep_time = timedelta(minutes=30)
    cleaning_time = timedelta(minutes=15)
    stquests = STQuest.objects.filter(date=stquest_date).order_by("date", "time")
    users = []
    for stquest in stquests:
        users.append(stquest.administrator)
        users.append(stquest.animator)
        users.extend(stquest.actors.all())
    users = list(set(users))
    for user in users:
        stquests_by_user = STQuest.objects.filter(date=stquest_date).filter(
            Q(administrator=user) | Q(animator=user) | Q(actors__in=[user])
        )
        if len(stquests_by_user) == 1:
            travel_data = {
                "date": stquests_by_user[0].date.strftime("%Y-%m-%d"),
                "amount": 25,
                "name": "Проезд",
                "user": user,
                "stquest": stquests_by_user[0],
            }
            QSalary(**travel_data).save()
            QSalary(**travel_data).save()
        elif len(stquests_by_user) >= 2:
            travel_data_now = {
                "date": stquests_by_user[0].date.strftime("%Y-%m-%d"),
                "amount": 25,
                "name": "Проезд",
                "user": user,
                "stquest": stquests_by_user[0],
            }
            travel_data_prev = {
                "date": stquests_by_user[len(stquests_by_user) - 1].date.strftime(
                    "%Y-%m-%d"
                ),
                "amount": 25,
                "name": "Проезд",
                "user": user,
                "stquest": stquests_by_user[len(stquests_by_user) - 1],
            }
            QSalary(**travel_data_now).save()
            QSalary(**travel_data_prev).save()

        prev_stquest_by_user = None
        for index, stquest_by_user in enumerate(stquests_by_user):
            if index == 0:
                prev_stquest_by_user = stquest_by_user
            if prev_stquest_by_user != stquest_by_user:
                new_prev_entry_time = (
                    datetime.combine(
                        prev_stquest_by_user.date, prev_stquest_by_user.time
                    )
                    + timedelta(minutes=prev_stquest_by_user.quest.duration_minute)
                    + cleaning_time
                )
                new_now_entry_time = (
                    datetime.combine(stquest_by_user.date, stquest_by_user.time)
                    - prep_time
                )
                if new_now_entry_time - new_prev_entry_time >= timedelta(hours=2):
                    travel_data_now = {
                        "date": stquest_by_user.date.strftime("%Y-%m-%d"),
                        "amount": 25,
                        "name": "Проезд",
                        "user": user,
                        "stquest": stquest_by_user,
                    }
                    travel_data_prev = {
                        "date": prev_stquest_by_user.date.strftime("%Y-%m-%d"),
                        "amount": 25,
                        "name": "Проезд",
                        "user": user,
                        "stquest": prev_stquest_by_user,
                    }
                    QSalary(**travel_data_now).save()
                    QSalary(**travel_data_prev).save()
                elif (
                    stquest_by_user.quest.address != prev_stquest_by_user.quest.address
                ):
                    travel_data_prev = {
                        "date": prev_stquest_by_user.date.strftime("%Y-%m-%d"),
                        "amount": 25,
                        "name": "Проезд",
                        "user": user,
                        "stquest": prev_stquest_by_user,
                    }
                    QSalary(**travel_data_prev).save()

            prev_stquest_by_user = stquest_by_user
