from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import *


class CustomDateFormatField(serializers.DateField):
    def to_representation(self, value):
        formatted_date = value.strftime("%d.%m.%Y")

        return formatted_date


class UserSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = User
        fields = [
            "key",
            "id",
            "username",
            "last_name",
            "first_name",
            "middle_name",
            "quest",
            "roles",
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


class TransactionSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()

    class Meta:
        model = Transaction
        fields = "__all__"


class STQuestSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()

    class Meta:
        model = STQuest
        fields = "__all__"

        depth = 1


class STExpenseSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()

    class Meta:
        model = STExpense
        fields = "__all__"

        depth = 1


class STBonusPenaltySerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()

    class Meta:
        model = STBonusPenalty
        fields = "__all__"

        depth = 1


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


class QIncomeSerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")

    class Meta:
        model = QIncome
        fields = "__all__"

        depth = 1


class QSalarySerializer(ModelSerializer):
    key = serializers.CharField(max_length=255, source="id")
    date = CustomDateFormatField()

    class Meta:
        model = QSalary
        fields = "__all__"

        depth = 1
