from datetime import datetime

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
        "paid_cash": int(data['cash_payment'])-int(data['cash_delivery']),
        "paid_non_cash": int(data['prepayment'])+int(data['cashless_payment'])-int(data['cashless_delivery']),
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
        "amount": int(data["cash_payment"])
        - int(data["cash_delivery"]),
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
        "description": data['name'],
        "stexpense": stexpense,
    }

    cash_register = QCashRegister(**local_data)
    cash_register.save()
