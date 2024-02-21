from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .sync_files import getCompaniesUploadedFiles, getBankReportFiles
from .models import CompanyModel
import json
from django.http import HttpResponse,JsonResponse
from rest_framework.response import Response
from rest_framework import status
import datetime
from datetime import timedelta
from django.views.decorators.http import require_POST,require_GET
import os
from django.core.mail import send_mail
from django.contrib.auth.models import User,Group
from .serializers import TransactionSerializer
from .models import (
    ProspectModel,
    SalespersonModel,
    CompanyModel,
    ManagerModel,
    TransactionModel,
    EmployeeModel,
    AuthLoginModel,
    BlockedIpAddressModel
)
from auth.two_factor_authentication import get_user_totp_device
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from base64 import b32encode
from collections import defaultdict


def is_internal(user):
    isAdmin = user.groups.filter(name='Admin').exists()
    isOperator = user.groups.filter(name='Operator').exists()
    isBankOperator = user.groups.filter(name='BankOperator').exists()
    check = True if isAdmin or isOperator or isBankOperator else False
    return check

def is_external(user):
    isManager = user.groups.filter(name='Manager').exists()
    isSalesperson = user.groups.filter(name='Salesperson').exists()
    check = True if isManager or isSalesperson else False
    return check
def has_group(user, group_name):
    return user.groups.filter(name=group_name).exists()


@require_GET
def testEmail(request):
    print("\n\nHey function!\n\n")
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [
    'benoit.kekwandi@final.edu.tr',
    'benoitkekwandi@gmail.com',
    'arekanteknoloji@gmail.com'
    ]
    send_mail('test','hey it is a test', from_email, recipient_list)
    return HttpResponse("Response")

def test404(request):
    return render(request, '404.html', status=404)


def handler404(request, exception, template_name="404.html"):
    return render(request, '404.html', status=404)

def handler403(request, exception, template_name="404.html"):
    return render(request, '404.html', status=404)

def handler500(request, exception, template_name="500.html"):
    return render(request, '500.html', status=500)

@login_required(login_url='/./auth/login')
def profile(request):
    context = {}
    context['user'] = request.user.first_name + ' '+ request.user.last_name
    context['email']= request.user.email
    context['date_joined']=request.user.date_joined
    device = get_user_totp_device(request.user)
    context['qr_code'] = device.config_url
    context['secret'] = b32encode(device.bin_key).decode('utf-8')
    return render(request, 'profile.html',context)

@login_required(login_url='/./auth/login')
def dashboard_main(request):
    numberOfSalespersons = SalespersonModel.objects.all().count()
    numberOfEmployees=EmployeeModel.objects.all().count()
    numberOfManagers=ManagerModel.objects.all().count()
    numberOfCompanies=CompanyModel.objects.all().count()
    btc=0
    eth=0
    usdt=0
    trx_coin=0
    commission = 0
    payable_amount = 0 
    if(request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists()):
        transactions = []
        for trx in TransactionModel.objects.filter(transaction_status=1).values():
            if datetime.datetime.fromtimestamp(float(trx['start_timestamp'])).date() == datetime.datetime.now().date():
                transactions.append(trx)
    if(request.user.groups.filter(name='Manager').exists()):
        managerCompanyId = ManagerModel.objects.get(user_id=request.user.id).company_id
        numberOfSalespersons = SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).count()
        salespersons = SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).values()
        transactions=[]
        for salesperson in salespersons:
            trxs = list(TransactionModel.objects.filter(salesperson_id=salesperson['id'],transaction_status=1).values())
            for trx in trxs:
                if datetime.datetime.fromtimestamp(float(trx['start_timestamp'])).date() == datetime.datetime.now().date():
                    transactions.append(trx)
    for transaction in transactions:
        if transaction['commission_type_id'] == 1:
            payable_amount += transaction['expected_amount']-(transaction['expected_amount']*transaction['commission_rate']*0.01)
        elif transaction['commission_type_id'] == 2:
            payable_amount += transaction['expected_amount']
        commission += (transaction['expected_amount']*transaction['commission_rate']*0.01)
        coin= transaction['coin']
        if coin =='BTC':
            btc+=transaction['received_crypto']
        elif coin =='ETH':
            eth+=transaction['received_crypto']
        elif coin =='USDT':
            usdt+=transaction['received_crypto']
        elif coin =='TRX':
            trx_coin+=transaction['received_crypto']
    companyId=0
    userGroup= Group.objects.get(user=request.user.id).name
    if userGroup=='Manager':
        companyId=ManagerModel.objects.get(user_id=request.user.id).company_id
    data={
        'btc':btc,
        'eth':eth,
        'usdt':usdt,
        'trx':trx_coin,
        'numberOfSalespersons':numberOfSalespersons,
        'numberOfEmployees':numberOfEmployees,
        'numberOfManagers':numberOfManagers,
        'numberOfCompanies':numberOfCompanies,
        'companyId':companyId,
        'userGroup':userGroup,
        'commission':f"{commission:.3f}",
        'amount':payable_amount
    }
    return render(request, 'dashboard_main.html',{'data':data})

@require_GET
@login_required(login_url='/./auth/login')
def wallet(request):
    return render(request, 'wallet.html')

@require_GET
@login_required(login_url='/./auth/login')
def managerial_reports(request):
    return render(request, 'reports/managerial_reports.html')


@login_required(login_url='/./auth/login')
def payone_Employee(request):
    return render(request, 'payone_Employee.html')


@login_required(login_url='/./auth/login')
def bank_operator(request):
    return render(request, 'bank_operator.html')


@login_required(login_url='/./auth/login')
def companies(request):
    return render(request, 'companies.html')

@login_required(login_url='/./auth/login')
def prospects(request):
    return render(request, 'prospects.html')

@login_required(login_url='/./auth/login')
def prospect_application(request,id):
    try:
        prospect = ProspectModel.objects.get(id=id)
    except ObjectDoesNotExist:
        return redirect('/404')
    prospect = ProspectModel.objects.get(id=id)
    context = model_to_dict(prospect)
    return render(request, 'application.html',context)

@login_required(login_url='/./auth/login')
def company_details(request, id):
    try:
        company = CompanyModel.objects.get(id=id)
    except CompanyModel.DoesNotExist:
        return redirect('/')
    companyId = CompanyModel.objects.get(id=id).id
    companyFolder = os.path.join(
        settings.BASE_DIR, 'uploads/companies/company-' +str(companyId)+'/')
    files = getCompaniesUploadedFiles(companyId, companyFolder)
    if request.method == 'POST':
        for file_name, file_content in request.FILES.items():
            with open(companyFolder + file_name, 'wb+') as destination:
                for chunk in file_content.chunks():
                    destination.write(chunk)
    return render(request, 'company_details.html', {'company': company, 'company_id': id, 'company_files': files})


@login_required(login_url='/./auth/login')
def managers(request):
    return render(request, 'managers.html')

@login_required(login_url='/./auth/login')
def salespersons(request):
    return render(request, 'salespersons.html')


@login_required(login_url='/./auth/login')
def general_wallet(request):
    transactions = TransactionModel.objects.filter(transaction_status=1).values()
    btc=0
    eth=0
    usdt=0
    trx_coin= 0
    commission = 0
    payable_amount = 0
    if(request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists()):
        pass
        
    if(request.user.groups.filter(name='Manager').exists()):
        managerCompanyId = ManagerModel.objects.get(user_id=request.user.id).company_id
        salespersons = SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).values()
        transactions=[]
        for salesperson in salespersons:
            trs = list(TransactionModel.objects.filter(salesperson_id=salesperson['id'],transaction_status=1).values())
            for tr in trs:
                transactions.append(tr)
    for transaction in transactions:
        if transaction['commission_type_id'] == 1:
            payable_amount += transaction['expected_amount']-(transaction['expected_amount']*transaction['commission_rate']*0.01)
        elif transaction['commission_type_id'] == 2:
            payable_amount += transaction['expected_amount']
        commission += (transaction['expected_amount']*transaction['commission_rate']*0.01)
        coin= transaction['coin']
        if coin =='BTC':
            btc+=transaction['received_crypto']
        elif coin =='ETH':
            eth+=transaction['received_crypto']
        elif coin =='USDT':
            usdt+=transaction['received_crypto']
        elif coin == 'TRX':
            trx_coin+=transaction['received_crypto']
    userGroup= Group.objects.get(user=request.user.id).name
    companyId=0
    if userGroup=='Manager':
        companyId=ManagerModel.objects.get(user_id=request.user.id).company_id
    data={
        'btc':btc,
        'eth':eth,
        'usdt':usdt,
        'trx':trx_coin,
        'userGroup':userGroup,
        'companyId':companyId,
        'commission':f"{commission:.3f}",
        'amount':payable_amount
    }
    
    print(f"Wallet data:{data}")
    return render(request, 'general_wallet.html',{'data':data})


@login_required(login_url='/./auth/login')
def deposit_history(request):
    return render(request, 'reports/deposit_history.html')


@login_required(login_url='/./auth/login')
def companies_reports(request):
    return render(request, 'reports/companies_reports.html')


@login_required(login_url='/./auth/login')
def managers_reports(request):
    return render(request, 'reports/managers_reports.html')


@login_required(login_url='/./auth/login')
def salespersons_reports(request):
    return render(request, 'reports/salespersons_reports.html')

 
@login_required(login_url='/auth/login/')
def daily_reports(request):
    folder_path = os.path.join(settings.BASE_DIR, 'uploads/bank_reports/')
    files = getBankReportFiles(folder_path)
    return render(request, 'reports/daily_reports.html', {'files': files})


@login_required(login_url='/auth/login/')
def bank_report(request):
    start_date = datetime.datetime(2023, 1, 1)
    end_date = datetime.datetime.now()
    step = datetime.timedelta(days=1)
    current_date = start_date
    transactions = TransactionModel.objects.filter(transaction_status=1)
    tr = []
    while current_date.date() <= end_date.date():
        l = [transaction.id for transaction in transactions
             if datetime.datetime.fromtimestamp(float(transaction.start_timestamp)).date() == current_date.date()]
        if l:
            daysAgo = (datetime.datetime.now() - current_date).days
            ts = {
                'date': current_date.strftime('%d-%m-%Y'),
                'transactions': len(l),
                "age":f"{daysAgo}",
                "values":l
            }
            tr.append(ts)
        current_date += step
        tr_sorted = sorted(tr, key=lambda x: datetime.datetime.strptime(x['date'], '%d-%m-%Y'))
        for index, item in enumerate(tr_sorted):
            item['id'] = index + 1
    return render(request, 'reports/reports.html', {'data': tr_sorted})

@login_required(login_url='/./auth/login')
def log_history(request):
    logins = AuthLoginModel.objects.all().values()
    for login in logins:
        block_count = BlockedIpAddressModel.objects.filter(ip_address=login['ip_address']).count()
        if block_count == 0:
            login['ip_status']=1
        elif block_count>0:
            login['ip_status']=0
    total_attempts =  0
    failed_attempts =  0
    successful_attempts =  0
    for log in logins:
        if log['success']==1:
            successful_attempts+=1
        elif log['success']==0:
            failed_attempts+=1
        total_attempts+=1
        log['role'] = Group.objects.get(user=log['user_id'])
    data={
        'total':total_attempts,
        'success':successful_attempts, 
        'failed':failed_attempts,
    }
    return render(request, 'log_history.html',{'authLogins':logins,'data':data})

@login_required(login_url='/./auth/login')
def users(request):
    users = list(User.objects.filter().values())
    for user in users:
        group = Group.objects.get(user=user['id'])
        user['role']=group
    data={
        'total':User.objects.all().count(),
        'active':User.objects.filter(is_active=1).count(),
        'inactive':User.objects.filter(is_active=0).count()
    }
    return render(request, 'users.html',{'users':users,'data':data})

@login_required(login_url='/./auth/login')
def accounting(request):
    data={
        'total':0,
        'total_commissions':0,
        'total_banks':0
    }
    return render(request, 'accounting.html',{'data':data})

@login_required(login_url='/./auth/login')
def transactionActions(request):
    if request.method == 'PUT':
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: How did you reach this page???"}, status=status.HTTP_400_BAD_REQUEST)
        data = json.loads(request.body)
        print(data)
        id = data.get('id')
        value = data.get('value')
        transaction = TransactionModel.objects.get(id=id)
        transaction.payone_status=value
        transaction.save()
        return HttpResponse({'status successfully updated'})