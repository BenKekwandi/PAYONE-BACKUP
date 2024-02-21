from rest_framework import serializers
from .models import CompanyModel, SalespersonModel, TransactionModel,AuthLoginModel, CommissionTypeModel


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyModel
        fields = '__all__'
        
class CommissionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionTypeModel
        fields = '__all__'


class SalespersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalespersonModel
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionModel
        fields = '__all__'


        
class AuthLoginModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthLoginModel
        fields = '__all__'


