import json

from datetime import datetime, timedelta

from django.db.models import Q

from .models import *


def create_non_empty_dict(request_body):
    try:
        data = {
            key: value
            for key, value in json.loads(request_body).items()
            if value not in ("", None)
        }
        return data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {}


def convert_to_date(date_string, format="%Y-%m-%dT%H:%M:%S.%fZ"):
    try:
        dt = datetime.strptime(date_string, format)  # parse the string
        dt += timedelta(hours=3)  # add 3 hours to the datetime
        formatted_date = dt.date()  # extract the date
        return formatted_date
    except ValueError as e:
        print(f"Error: {e}")
        return None


def date_to_timestamp(date):
    return int(datetime(date.year, date.month, date.day).timestamp())


def create_qincome(data, entry):
    if "date" in data:
        formatted_date = convert_to_date(data["date"])
    else:
        formatted_date = entry.date
    if "time" in data:
        formatted_time_without_3_hours = datetime.fromisoformat(
            data["time"].replace("Z", "")
        ).time()
        formatted_time = (
            datetime.combine(datetime.min, formatted_time_without_3_hours)
            + timedelta(hours=3)
        ).time()
    else:
        formatted_time = entry.time

    if "quest" in data:
        quest = Quest.objects.get(id=data["quest"])

        if quest.parent_quest != None:
            if ("photomagnets_quantity") in data:
                photomagnets_promo = int(data["photomagnets_quantity"]) // 2
                photomagnets_not_promo = (
                    int(data["photomagnets_quantity"]) - photomagnets_promo
                )
                photomagnets_sum = (
                    photomagnets_not_promo * 250 + photomagnets_promo * 150
                )

            local_data = {
                "date": formatted_date,
                "time": formatted_time,
                "stquest": entry,
                "quest": Quest.objects.get(id=quest.parent_quest.id),
            }

            if "is_package" in data:
                local_data.update({"is_package": data["is_package"]})

            if "add_players" not in data:
                data["add_players"] = 0
            if "easy_work" not in data:
                data["easy_work"] = 0
            if "night_game" not in data:
                data["night_game"] = 0
            if "discount_sum" not in data:
                data["discount_sum"] = 0
            if "cash_payment" not in data:
                data["cash_payment"] = 0
            if "cash_delivery" not in data:
                data["cash_delivery"] = 0
            if "cashless_payment" not in data:
                data["cashless_payment"] = 0
            if "cashless_delivery" not in data:
                data["cashless_delivery"] = 0
            if "discount_desc" not in data:
                data["discount_desc"] = ""

            # local_data['game'] = (int(data['quest_cost']) + int(data['add_players']) + int(data['easy_work']) + int(data['night_game']) - int(data['discount_sum']))
            local_data["game"] = (
                int(data["quest_cost"])
                + int(data["add_players"])
                + int(data["easy_work"])
                + int(data["night_game"])
            )
            
            # if local_data['discount_sum']:
            # local_data['game_tooltip'] =
            # local_data['game'] = {
            #     "value": int(data['quest_cost']) + int(data['add_players']) + int(data['easy_work']) + int(data['night_game']) - int(data['discount_sum']),
            #     "tooltip": ""
            # }

            local_data["discount_sum"] = int(data["discount_sum"])
            local_data["discount_desc"] = data["discount_desc"]
            local_data["easy_work"] = data["easy_work"]

            local_data["paid_cash"] = int(data["cash_payment"]) - int(
                data["cash_delivery"]
            )
            local_data["paid_non_cash"] = (
                int(data["cashless_payment"])
                - int(data["cashless_delivery"])
                + int(data["prepayment"])
            )

            if "actor_or_second_actor_or_animator" in data:
                new_data = {
                    "actor": int(data["actor_or_second_actor_or_animator"]),
                }
                local_data.update(new_data)

            if "room_sum" in data:
                new_data = {"room": int(data["room_sum"])}

                local_data.update(new_data)

            if "video" in data:
                new_data = {"video": int(data["video"])}
                local_data.update(new_data)

            if "photomagnets_quantity" in data:
                new_data = {"photomagnets": int(photomagnets_sum)}
                local_data.update(new_data)

            # if ("cash_payment" in data) and ("cash_delivery" in data):
            new_data = {
                "paid_cash": int(data["cash_payment"]) - int(data["cash_delivery"]),
            }
            local_data.update(new_data)

            # if (
            #     ("prepayment" in data)
            #     and ("cashless_payment" in data)
            #     and ("cashless_delivery" in data)
            # ):
            new_data = {
                "paid_non_cash": int(data["prepayment"])
                + int(data["cashless_payment"])
                - int(data["cashless_delivery"]),
            }
            local_data.update(new_data)

            qincome = QIncome(**local_data)
            qincome.save()

        elif quest.special_versions.exists():
            for special_version in quest.special_versions.all():
                if ("photomagnets_quantity") in data:
                    photomagnets_promo = int(data["photomagnets_quantity"]) // 2
                    photomagnets_not_promo = (
                        int(data["photomagnets_quantity"]) - photomagnets_promo
                    )
                    photomagnets_sum = (
                        photomagnets_not_promo * 250 + photomagnets_promo * 150
                    )

                local_data = {
                    "date": formatted_date,
                    "time": formatted_time,
                    "stquest": entry,
                    "quest": special_version,
                }

                if "is_package" in data:
                    local_data.update({"is_package": data["is_package"]})
                if "add_players" not in data:
                    data["add_players"] = 0
                if "easy_work" not in data:
                    data["easy_work"] = 0
                if "night_game" not in data:
                    data["night_game"] = 0
                if "discount_sum" not in data:
                    data["discount_sum"] = 0
                if "cash_payment" not in data:
                    data["cash_payment"] = 0
                if "cash_delivery" not in data:
                    data["cash_delivery"] = 0
                if "cashless_payment" not in data:
                    data["cashless_payment"] = 0
                if "cashless_delivery" not in data:
                    data["cashless_delivery"] = 0
                if "discount_desc" not in data:
                    data["discount_desc"] = ""

                # local_data['game'] = (int(data['quest_cost']) + int(data['add_players']) + int(data['easy_work']) + int(data['night_game']) - int(data['discount_sum'])) / 2
                # sum_for_game = (int(data['quest_cost']) + int(data['add_players']) + int(data['easy_work']) + int(data['night_game']) - int(data['discount_sum'])) / 2
                local_data["game"] = (
                    int(data["quest_cost"])
                    + int(data["add_players"])
                    + int(data["easy_work"])
                    + int(data["night_game"])
                ) / 2
                # local_data['game_tooltip'] = f"{special_version} - {sum_for_game/2}"

                local_data["discount_sum"] = int(data["discount_sum"])
                local_data["discount_desc"] = data["discount_desc"]
                local_data["easy_work"] = data["easy_work"]

                local_data["paid_cash"] = int(data["cash_payment"]) - int(
                    data["cash_delivery"]
                )
                local_data["paid_non_cash"] = (
                    int(data["cashless_payment"])
                    - int(data["cashless_delivery"])
                    + int(data["prepayment"])
                )

                if "actor_or_second_actor_or_animator" in data:
                    new_data = {
                        "actor": int(data["actor_or_second_actor_or_animator"]),
                    }
                    local_data.update(new_data)

                if "room_sum" in data:
                    new_room_sum = 0
                    if quest.name == "Проклятые" or quest.name == "Логово Ведьмы":
                        new_room_sum_for_room404 = (data["room_sum"] - 100) / 2
                        new_room_sum = data["room_sum"] - new_room_sum_for_room404
                        new_data = {"room": new_room_sum}

                        quest_room404 = Quest.objects.get(name="Квартира 404")
                        local_data_for404 = {
                            "date": formatted_date,
                            "time": formatted_time,
                            "stquest": entry,
                            "quest": quest_room404,
                            "room": new_room_sum_for_room404,
                        }
                        qincome2 = QIncome(**local_data_for404)
                        qincome2.save()

                        if "is_package" in data:
                            new_game_sum = data["quest_cost"] - 250
                            new_sum_for_room404 = 250
                            local_data_for_package = {
                                "date": formatted_date,
                                "time": formatted_time,
                                "stquest": entry,
                                "quest": quest_room404,
                                "game": new_game_sum
                                # "game": {
                                # "tooltip": "Пакет",
                                # "value": new_game_sum,
                                # }
                            }
                            local_data_for404_package = {
                                "date": formatted_date,
                                "time": formatted_time,
                                "stquest": entry,
                                "quest": quest_room404,
                                "room": new_sum_for_room404,
                            }
                            QIncome(**local_data_for_package).save()
                            QIncome(**local_data_for404_package).save()

                        # else:

                    else:
                        new_data = {"room": int(data["room_sum"])}

                    local_data.update(new_data)

                if "video" in data:
                    new_data = {"video": int(data["video"])}
                    local_data.update(new_data)

                if "photomagnets_quantity" in data:
                    new_data = {"photomagnets": int(photomagnets_sum)}
                    local_data.update(new_data)

                # if ("cash_payment" in data) and ("cash_delivery" in data):
                new_data = {
                    "paid_cash": (
                        int(data["cash_payment"]) - int(data["cash_delivery"])
                    )
                    / 2,
                }
                local_data.update(new_data)

                # if (
                #     ("prepayment" in data)
                #     and ("cashless_payment" in data)
                #     and ("cashless_delivery" in data)
                # ):
                new_data = {
                    "paid_non_cash": (
                        int(data["prepayment"])
                        + int(data["cashless_payment"])
                        - int(data["cashless_delivery"])
                    )
                    / 2,
                }
                local_data.update(new_data)

                qincome = QIncome(**local_data)
                qincome.save()
        else:
            if ("photomagnets_quantity") in data:
                photomagnets_promo = int(data["photomagnets_quantity"]) // 2
                photomagnets_not_promo = (
                    int(data["photomagnets_quantity"]) - photomagnets_promo
                )
                photomagnets_sum = (
                    photomagnets_not_promo * 250 + photomagnets_promo * 150
                )

            local_data = {
                "date": formatted_date,
                "time": formatted_time,
                "stquest": entry,
                "quest": quest,
            }

            if "is_package" in data:
                local_data.update({"is_package": data["is_package"]})

            if "add_players" not in data:
                data["add_players"] = 0
            if "easy_work" not in data:
                data["easy_work"] = 0
            if "night_game" not in data:
                data["night_game"] = 0
            if "discount_sum" not in data:
                data["discount_sum"] = 0
            if "cash_payment" not in data:
                data["cash_payment"] = 0
            if "cash_delivery" not in data:
                data["cash_delivery"] = 0
            if "cashless_payment" not in data:
                data["cashless_payment"] = 0
            if "cashless_delivery" not in data:
                data["cashless_delivery"] = 0
            if "discount_desc" not in data:
                data["discount_desc"] = ""

            # local_data['game'] = (int(data['quest_cost']) + int(data['add_players']) + int(data['easy_work']) + int(data['night_game']) - int(data['discount_sum']))
            local_data["game"] = (
                int(data["quest_cost"])
                + int(data["add_players"])
                + int(data["easy_work"])
                + int(data["night_game"])
            )
            # if local_data['discount_sum']:
            # local_data['game_tooltip'] =
            # local_data['game'] = {
            #     "value": int(data['quest_cost']) + int(data['add_players']) + int(data['easy_work']) + int(data['night_game']) - int(data['discount_sum']),
            #     "tooltip": ""
            # }

            local_data["discount_sum"] = int(data["discount_sum"])
            local_data["discount_desc"] = data["discount_desc"]
            local_data["easy_work"] = data["easy_work"]

            local_data["paid_cash"] = int(data["cash_payment"]) - int(
                data["cash_delivery"]
            )
            local_data["paid_non_cash"] = (
                int(data["cashless_payment"])
                - int(data["cashless_delivery"])
                + int(data["prepayment"])
            )

            if "actor_or_second_actor_or_animator" in data:
                new_data = {
                    "actor": int(data["actor_or_second_actor_or_animator"]),
                }
                local_data.update(new_data)

            if "room_sum" in data:
                new_data = {"room": int(data["room_sum"])}

                local_data.update(new_data)

            if "video" in data:
                new_data = {"video": int(data["video"])}
                local_data.update(new_data)

            if "photomagnets_quantity" in data:
                new_data = {"photomagnets": int(photomagnets_sum)}
                local_data.update(new_data)

            # if ("cash_payment" in data) and ("cash_delivery" in data):
            new_data = {
                "paid_cash": int(data["cash_payment"]) - int(data["cash_delivery"]),
            }
            local_data.update(new_data)

            # if (
            #     ("prepayment" in data)
            #     and ("cashless_payment" in data)
            #     and ("cashless_delivery" in data)
            # ):
            new_data = {
                "paid_non_cash": int(data["prepayment"])
                + int(data["cashless_payment"])
                - int(data["cashless_delivery"]),
            }
            local_data.update(new_data)

            qincome = QIncome(**local_data)
            qincome.save()


def create_qcash_register_from_stquest(data, entry):
    formatted_date = convert_to_date(data["date"])

    quest = Quest.objects.get(id=data["quest"])
    new_quest = quest

    print(data["cash_payment"])
    print(data["cash_delivery"])

    if (quest.parent_quest != None):
        new_quest = Quest.objects.get(id=quest.parent_quest.id)

    local_data2 = {
        "date": formatted_date,
        "amount": int(data["cash_payment"]) - int(data["cash_delivery"]),
        "stquest": entry,
        "quest": new_quest,
    }

    cash_register = QCashRegister(**local_data2)

    # if (int(data["cash_payment"]) != 0):
    cash_register.save()


def create_qcash_register_from_stexpense(data):
    formatted_date = datetime.strptime(data["date"], "%Y-%m-%dT%H:%M:%S.%fZ").date()

    local_data = {
        "date": formatted_date,
        "amount": -int(data["amount"]),
        "description": data["name"],
        "stexpense": data,
    }

    cash_register = QCashRegister(**local_data)
    cash_register.save()


def create_travel(entry, quest):
    # quest_id = quest.id
    # quests = Quest.objects.filter(id=quest_id)
    # print(quests)

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
    users = [item for item in users if item is not None]
    for user in users:
        stquests_by_user = (
            STQuest.objects.filter(date=stquest_date)
            .order_by("date", "time")
            .filter(Q(administrator=user) | Q(animator=user) | Q(actors__in=[user]))
        )

        new_quest0 = stquests_by_user[0].quest
        new_questlen = stquests_by_user[len(stquests_by_user) - 1].quest

        if new_quest0.parent_quest != None:
            new_quest0 = new_quest0.parent_quest
        if new_questlen.parent_quest != None:
            new_questlen = new_questlen.parent_quest

        if len(stquests_by_user) == 1:           
            travel_data = {
                "date": stquests_by_user[0].date.strftime("%Y-%m-%d"),
                "amount": 25,
                "name": "Проезд",
                "user": user,
                "stquest": stquests_by_user[0],
                "quest": new_quest0,
                "sub_category": "actor",
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
                "quest": new_quest0,
                "sub_category": "actor",
            }
            travel_data_prev = {
                "date": stquests_by_user[len(stquests_by_user) - 1].date.strftime(
                    "%Y-%m-%d"
                ),
                "amount": 25,
                "name": "Проезд",
                "user": user,
                "stquest": stquests_by_user[len(stquests_by_user) - 1],
                "quest": new_questlen,
                "sub_category": "actor",
            }
            QSalary(**travel_data_now).save()
            QSalary(**travel_data_prev).save()

        prev_stquest_by_user = None
        for index, stquest_by_user in enumerate(stquests_by_user):
            if index == 0:
                prev_stquest_by_user = stquest_by_user
                
            new_quest = stquest_by_user.quest
            if (stquest_by_user.quest.parent_quest != None):
                new_quest = stquest_by_user.quest.parent_quest
            prev_new_quest = prev_stquest_by_user.quest
            if (prev_stquest_by_user.quest.parent_quest != None):
                prev_new_quest = prev_stquest_by_user.quest.parent_quest

            # print(new_quest)
            # print(prev_new_quest)
                
            if prev_stquest_by_user != stquest_by_user:
                if (stquest_by_user.quest.parent_quest != None):
                    stquest_by_user.quest.address = stquest_by_user.quest.parent_quest.address
                    stquest_by_user.quest.duration_in_minute = stquest_by_user.quest.parent_quest.duration_in_minute
                    stquest_by_user.quest = stquest_by_user.quest.parent_quest

                if (prev_stquest_by_user.quest.parent_quest != None):
                    prev_stquest_by_user.quest.address = prev_stquest_by_user.quest.parent_quest.address
                    prev_stquest_by_user.quest.duration_in_minute = prev_stquest_by_user.quest.parent_quest.duration_in_minute
                    prev_stquest_by_user.quest = prev_stquest_by_user.quest.parent_quest

                new_prev_entry_time = (
                    datetime.combine(
                        prev_stquest_by_user.date, prev_stquest_by_user.time
                    )
                    + timedelta(minutes=prev_stquest_by_user.quest.duration_in_minute)
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
                        "quest": new_quest,
                        "sub_category": "actor",
                    }
                    travel_data_prev = {
                        "date": prev_stquest_by_user.date.strftime("%Y-%m-%d"),
                        "amount": 25,
                        "name": "Проезд",
                        "user": user,
                        "stquest": prev_stquest_by_user,
                        "quest": prev_new_quest,
                        "sub_category": "actor",
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
                        "quest": prev_new_quest,
                        "sub_category": "actor",
                    }
                    QSalary(**travel_data_prev).save()

            prev_stquest_by_user = stquest_by_user


def convert_with_children(entries, keys_to_remove):
    keys = set()
    keys_to_remove_local = ["_state", "date", "time"] + keys_to_remove
    for entry in entries:
        keys.update(entry.__dict__.keys())
    keys = [x for x in keys if x not in keys_to_remove_local]
    keys = list(keys)

    entry_dict = {}

    for entry in entries:
        date_timestamp = date_to_timestamp(entry.date)
        date_str = entry.date.strftime("%d.%m.%Y")

        if date_timestamp not in entry_dict:
            entry_dict[date_timestamp] = {}
            for key in keys:
                entry_dict[date_timestamp][key] = entry.__dict__[key]
            entry_dict[date_timestamp]["id"] = str(entry.id).zfill(2)
            entry_dict[date_timestamp]["key"] = str(date_timestamp)
            entry_dict[date_timestamp]["date_time"] = date_str
            entry_dict[date_timestamp]["children"] = []

        for key in keys:
            entry_dict[date_timestamp][key] = []
            # if isinstance(entry.__dict__[key], str):
            # entry_dict[date_timestamp][key] += " " + entry.__dict__[key]
            entry_dict[date_timestamp][key].append(entry.__dict__[key])

        entry_time = entry.time.strftime("%H:%M")
        entry_data = {"id": entry.id, "key": str(entry.id), "date_time": entry_time}
        for key in keys:
            value = getattr(entry, key, None)
            entry_data[key] = []
            entry_data[key].append(value)
        entry_dict[date_timestamp]["children"].append(entry_data)

    for date_data in entry_dict.values():
        date_data["children"].sort(key=lambda x: x["date_time"])

    response_data = list(entry_dict.values())

    return response_data
