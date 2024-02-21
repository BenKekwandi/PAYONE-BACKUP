from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class AuthLoginModel(models.Model):
    user_id = models.IntegerField(null=True)
    identifier = models.CharField(max_length=255)
    login_datetime = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=255)
    country = models.CharField(max_length=50, null=True)
    region = models.CharField(max_length=50, null=True)
    user_agent = models.CharField(max_length=255)
    success = models.IntegerField()
    class Meta:
        db_table = "auth_logins"

class AuthPasswordTokenModel(models.Model):
    token_string = models.CharField(max_length=60)
    user_id = models.IntegerField()
    expiration_date = models.DateTimeField()
    generation_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auth_password_token"


class CompanyModel(models.Model):
    company_name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.CharField(max_length=255)
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
    status = models.IntegerField(default=0)
    def __str__(self):
        return self.company_name
    class Meta:
        db_table = "prospect"


class SalespersonModel(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=14)
    address = models.CharField(max_length=255)
    virtual_email = models.CharField(max_length=45)
    company_id = models.IntegerField()
    user_id = models.IntegerField()
    status = models.IntegerField(default=0)

    def __str__(self):
        return f'%s %s' % (self.name, self.surname)

    class Meta:
        db_table = "salesperson"


class TransactionModel(models.Model):
    company_id = models.IntegerField(null=True)
    commission_type_id = models.IntegerField()
    salesperson_id = models.IntegerField()
    api_trans_id = models.CharField(max_length=255, null=True)
    start_timestamp = models.CharField(max_length=13, null=True)
    approval_timestamp = models.CharField(max_length=13, null=True)
    insert_timestamp = models.CharField(max_length=25, null=True)
    expected_amount = models.FloatField()
    expected_crypto = models.FloatField()
    commission_rate = models.FloatField()
    received_crypto = models.FloatField(null=True)
    banknote = models.CharField(max_length=4)
    exchange_rate = models.FloatField()
    address = models.CharField(max_length=255)
    coin = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    network = models.CharField(max_length=6, null=True)
    api_status = models.CharField(max_length=10,null=True)
    payone_status = models.IntegerField(default=0)
    transaction_status = models.IntegerField(default=0)
    payed = models.IntegerField(default=0)

    def __str__(self):
        return self.api_trans_id

    class Meta:
        db_table = "transaction"
