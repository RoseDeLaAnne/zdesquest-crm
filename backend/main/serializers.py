from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import AnonymousUser

from .models import *


class CustomDateFormatField(serializers.DateField):
    def to_representation(self, value):
        formatted_date = value.strftime("%d.%m.%Y")

        return formatted_date


class UserSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date_of_birth = CustomDateFormatField()
    internship_period_start = CustomDateFormatField()
    internship_period_end = CustomDateFormatField()

    class Meta:
        model = User
        fields = [
            "key",
            "id",
            "email",
            "phone_number",
            "last_name",
            "first_name",
            "middle_name",
            "date_of_birth",
            "internship_period_start",
            "internship_period_end",
            "quest",
            "roles",
            "internship_quest",
            "is_active",
            "is_superuser",
        ]

        depth = 1

    # def to_representation(self, instance):
    #     if not isinstance(instance, AnonymousUser):
    #         return super().to_representation(instance)
    #     return {}


class RoleSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = Role
        fields = "__all__"


class QuestSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = Quest
        fields = "__all__"

        depth = 1

class QuestVersionSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = QuestVersion
        fields = "__all__"


class STQuestSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date_time = CustomDateFormatField(source="date")
    date = CustomDateFormatField()
    # quest = serializers.IntegerField(source="quest.id")
    # administrator = serializers.IntegerField(source="administrator.id")
    # room_employee_name = serializers.IntegerField(source="room_employee_name.id")
    # animator = serializers.IntegerField(source="animator.id")

    class Meta:
        model = STQuest
        fields = "__all__"

        depth = 1

    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     data["actors"] = [f"{actor['first_name']} {actor['last_name']}" for actor in data["actors"]]
    #     return data


class STExpenseSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()
    # sub_category = serializers.SerializerMethodField()

    class Meta:
        model = STExpense
        fields = [
            "id",
            "key",
            "date",
            "name",
            "description",
            "amount",
            "sub_category",
            "quests",
            "paid_from",
            "who_paid",
            "employees",
            "created_by",
            # "who_paid_amount",
            # "attachment",
        ]

        depth = 1

    # def get_sub_category(self, obj):
    #     sub_category = obj.sub_category
    #     return {"name": sub_category.name}

    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     data["quests"] = [quest["name"] for quest in data["quests"]]
    #     return data


class STBonusPenaltySerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()

    class Meta:
        model = STBonusPenalty
        fields = '__all__'

        depth = 1


class QSalarySerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = QSalary
        
        fields = ['date', 'amount', 'name', 'id', 'key', 'user', 'sub_category']

        depth = 1

    def get_user(self, obj):
        user = obj.user
        return {"id": user.id, "username": user.username}


# class STBonusSerializer(ModelSerializer):
#     key = serializers.CharField(max_length=255, source="id")
#     date = CustomDateFormatField()
#     user = serializers.SerializerMethodField()

#     class Meta:
#         model = STBonus
#         fields = "__all__"

#         depth = 1

#     def get_user(self, obj):
#         user = obj.user
#         return {"id": user.id, "first_name": user.first_name}

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         data["quests"] = [quest["name"] for quest in data["quests"]]
#         return data


# class STPenaltySerializer(ModelSerializer):
#     key = serializers.CharField(max_length=255, source="id")
#     date = CustomDateFormatField()
#     user = serializers.SerializerMethodField()

#     class Meta:
#         model = STPenalty
#         fields = "__all__"

#         depth = 1

#     def get_user(self, obj):
#         user = obj.user
#         return {"id": user.id, "first_name": user.first_name}

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         data["quests"] = [quest["name"] for quest in data["quests"]]
#         return data


class STExpenseCategorySerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = STExpenseCategory
        fields = "__all__"


class STExpenseSubCategorySerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = STExpenseSubCategory
        fields = "__all__"

        depth = 1


class QIncomeSerializer(ModelSerializer):
    date = CustomDateFormatField()
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = QIncome
        fields = "__all__"

        depth = 1


class QExpenseSerializer(ModelSerializer):
    date = CustomDateFormatField()
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = STExpense
        fields = "__all__"

        depth = 1


# class QSalarySerializer(ModelSerializer):
#     key = serializers.CharField(max_length=255, source="id")
#     date = CustomDateFormatField()

#     class Meta:
#         model = QSalary
#         fields = "__all__"

#         depth = 1


class QCashRegisterSerializer(ModelSerializer):
    date = CustomDateFormatField()
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = QCashRegister
        fields = "__all__"

        depth = 1


class WorkCardExpenseSerializer(ModelSerializer):
    date = CustomDateFormatField()
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = WorkCardExpense
        fields = "__all__"

        depth = 1


class ExpenseFromTheirSerializer(ModelSerializer):
    date = CustomDateFormatField()
    key = serializers.CharField(max_length=255, source="id")
    who_paid = serializers.SerializerMethodField()

    class Meta:
        model = ExpenseFromTheir
        fields = "__all__"

        depth = 1

    def get_who_paid(self, obj):
        who_paid = obj.who_paid
        return {
            "id": who_paid.id,
            "first_name": who_paid.first_name,
            "last_name": who_paid.last_name,
        }


class QVideoSerializer(ModelSerializer):
    date = CustomDateFormatField()
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = QVideo
        fields = "__all__"

        depth = 1

class ChildSerializer(serializers.Serializer):
        value = serializers.IntegerField()
        tooltip = serializers.CharField()

class SummarySerializer(serializers.Serializer):
    date = serializers.CharField()
    children = ChildSerializer(many=True)
