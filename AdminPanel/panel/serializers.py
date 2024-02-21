from rest_framework import serializers
from .models import CompanyModel, SalespersonModel, EmployeeModel, ManagerModel, BankOperatorModel, TransactionModel,ProspectModel,CommissionTypeModel


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyModel
        fields = '__all__'
        
class CommissionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionTypeModel
        fields = '__all__'

class ProspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProspectModel
        fields = '__all__'


class SalespersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalespersonModel
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeModel
        fields = '__all__'


class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerModel
        fields = '__all__'


class BankOperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankOperatorModel
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransactionModel
        fields = '__all__'
