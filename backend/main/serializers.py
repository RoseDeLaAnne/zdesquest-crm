from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import *


class CustomDateFormatField(serializers.DateField):
    def to_representation(self, value):
        formatted_date = value.strftime("%d.%m.%Y")

        return formatted_date


class UserSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date_of_birth = CustomDateFormatField()

    class Meta:
        model = User
        fields = [
            "key",
            "id",
            "username",
            "email",
            "phone_number",
            "last_name",
            "first_name",
            "middle_name",
            "date_of_birth",
            "quest",
            "is_superuser",
        ]

        depth = 1


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


# class TransactionSerializer(ModelSerializer):
#     key = serializers.CharField(max_length=255, source="id")
#     date = CustomDateFormatField()

#     class Meta:
#         model = Transaction
#         fields = "__all__"


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
    sub_category = serializers.SerializerMethodField()

    class Meta:
        model = STExpense
        fields = [
            "key",
            "date",
            "name",
            "amount",
            "sub_category",
            "quests",
            "who_paid",
            "who_paid_amount",
            "image",
        ]

        depth = 1

    def get_sub_category(self, obj):
        sub_category = obj.sub_category
        return {"name": sub_category.name, "latin_name": sub_category.latin_name}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["quests"] = [quest["name"] for quest in data["quests"]]
        return data


class STBonusPenaltySerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()

    class Meta:
        model = STBonusPenalty
        fields = "__all__"

        depth = 1

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
