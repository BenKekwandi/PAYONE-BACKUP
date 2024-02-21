from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import datetime


class BlockedIpAddressModel(models.Model):
    ip_address = models.CharField(max_length=21)
    def exist(self, ip):
        count = self.objects.filter(ip_address=ip).count()
        if count==0:
            return False
        else:
            return True
    class Meta:
        db_table = "blocked_ips"
class AuthPasswordTokenModel(models.Model):
    token_string = models.CharField(max_length=60)
    user_id = models.IntegerField()
    expiration_date = models.DateTimeField()
    generation_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auth_password_token"
'''   
class AuthUserGroupModel(models.Model):
    user_id = models.IntegerField()
    group_id = models.IntegerField()
    class Meta:
        db_table = "auth_user_groups"
'''

class AuthLoginModel(models.Model):
    user_id = models.IntegerField()
    identifier = models.CharField(max_length=255)
    login_datetime = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=255)
    country = models.CharField(max_length=50)
    region = models.CharField(max_length=50)
    user_agent = models.CharField(max_length=255)
    success = models.IntegerField()
    class Meta:
        db_table = "auth_logins"


class CompanyModel(models.Model):
    company_name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    bank_account_no = models.CharField(max_length=255)
    commission_rate = models.FloatField()
    commission_type_id = models.IntegerField()
    phone = models.CharField(max_length=35)
    status = models.IntegerField(default=0)
    def __str__(self):
        return self.company_name
    class Meta:
        db_table = "company"
        
class CommissionTypeModel(models.Model):
    description = models.CharField(max_length=50)
    def __str__(self):
        return self.description
    class Meta:
        db_table = "commission_type"

class ProspectModel(models.Model):
    company_name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    post_code = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    business_registration_number = models.CharField(max_length=255)
    website = models.CharField(max_length=255)
    registration_date = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField()
    def __str__(self):
        return self.company_name
    class Meta:
        db_table = "prospect"


class SalespersonModel(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=35)
    address = models.CharField(max_length=255)
    virtual_email = models.CharField(max_length=45, null=True)
    company_id = models.IntegerField()
    user_id = models.IntegerField()
    status = models.IntegerField(default=0)

    def __str__(self):
        return f'%s %s' % (self.name, self.surname)

    class Meta:
        db_table = "salesperson"


class EmployeeModel(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=14)
    address = models.CharField(max_length=255)
    position = models.CharField(max_length=20)
    user_id = models.IntegerField()
    status = models.IntegerField(default=0)

    def __str__(self):
        return f'%s %s' % (self.name, self.surname)

    class Meta:
        db_table = "employee"


class ManagerModel(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=14)
    address = models.CharField(max_length=255)
    user_id = models.IntegerField()
    company_id = models.IntegerField()
    status = models.IntegerField(default=0)

    def __str__(self):
        return f'%s %s' % (self.name, self.surname)

    class Meta:
        db_table = "manager"


class BankOperatorModel(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=14)
    address = models.CharField(max_length=255)
    user_id = models.IntegerField()
    status = models.IntegerField(default=0)

    def __str__(self):
        return f'%s %s' % (self.name, self.surname)

    class Meta:
        db_table = "bank_operator"


class TransactionModel(models.Model):
    company_id=models.IntegerField()
    commission_type_id = models.IntegerField()
    salesperson_id = models.IntegerField()
    #identification= models.CharField(max_length=255)
    api_trans_id = models.CharField(max_length=255)
    start_timestamp = models.CharField(max_length=13)
    approval_timestamp = models.CharField(max_length=13)
    insert_timestamp = models.CharField(max_length=13)
    expected_amount = models.FloatField()
    expected_crypto = models.FloatField()
    commission_rate = models.FloatField()
    received_crypto = models.FloatField()
    banknote = models.CharField(max_length=4)
    exchange_rate = models.FloatField()
    address = models.CharField(max_length=255)
    coin = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    network = models.CharField(max_length=3)
    api_status = models.IntegerField()
    payone_status = models.IntegerField()
    transaction_status = models.IntegerField()
    payed = models.IntegerField()

    def __str__(self):
        return self.api_trans_id

    class Meta:
        db_table = "transaction"
