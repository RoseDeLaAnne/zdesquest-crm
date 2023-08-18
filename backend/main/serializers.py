from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        key = serializers.CharField(max_length=50, source='id')

        model = User
        # fields = ['id', 'username', 'last_name', 'first_name', 'middle_name']
        fields = '__all__'

        depth = 1

class QuestSerializer(ModelSerializer):
    class Meta:
        model = Quest
        fields = '__all__'

class QuestFormSerializer(ModelSerializer):
    class Meta:
        model = QuestForm
        fields = '__all__'

# class SalarySerializer(ModelSerializer):
#     class Meta:
#         model = Salary
#         fields = '__all__'

#         # depth = 1

class ExpensesSerializer(ModelSerializer):
    class Meta:
        model = Expenses
        fields = '__all__'

        depth = 1
        
# class IncomeSerializer(ModelSerializer):
#     key = serializers.CharField(max_length=50, source='id')

#     class Meta:
#         model = Income
#         fields = '__all__'

#         depth = 1

class TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        # fields = ('id', 'time')
        fields = '__all__'

class NestedIncomeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Income
        fields = ('id', 'date', 'children')

    def get_children(self, instance):
        incomes_with_same_date = Income.objects.filter(date=instance.date)
        # times = incomes_with_same_date.values('id', 'time')
        return TimeSerializer(incomes_with_same_date, many=True).data
    
class SalaryTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = '__all__'

        depth = 1

class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = ['id', 'date', 'children']

        def get_children(self, instance):
            incomes_with_same_date = Salary.objects.filter(date=instance.date)
            return SalaryTimeSerializer(incomes_with_same_date, many=True).data
        
class Additional1Serializer(serializers.ModelSerializer):
    key = serializers.CharField(max_length=50, source='id')

    class Meta:
        model = Additional1Form
        fields = '__all__'

        # depth = 1
        