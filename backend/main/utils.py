from datetime import datetime

from .models import *


def create_qincome(data, stquest_id):
    formatted_date = datetime.fromisoformat(data["date"]).date()
    formatted_time = datetime.fromisoformat(data["time"]).time()
    
    stquest = STQuest.objects.get(id=stquest_id)
    quest = Quest.objects.get(name=data["quest"])

    photomagnets_promo = int(data["photomagnets_quantity"]) // 2
    photomagnets_not_promo = int(data["photomagnets_quantity"]) - photomagnets_promo
    photomagnets_sum = photomagnets_not_promo * 250 + photomagnets_promo * 150

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
    }

    qincome = QIncome(**local_data)
    qincome.save()
