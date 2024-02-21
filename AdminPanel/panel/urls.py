from django.urls import path
from . import views
from . import files
from . import digital
from .excel import getDailyBankReport, getMonthlyBankReport, getFullBankReport
from .rest.company import Company, CompanyDetail,AllCompany
from .rest.prospect import Prospect, ProspectDetail
from .rest.salesperson import Salesperson, SalespersonDetail, SalespersonCompany,AllSalesperson
from .rest.user import UserActivation,IpBlock,UserPasswordLink
from .rest.employee import Employee, EmployeeDetail,AllEmployee
from .rest.bankOperator import BankOperator, BankOperatorDetail, AllBankOperator
from .rest.manager import Manager, ManagerDetail, ManagerCompany, AllManager
from .rest.commissionType import CommissionType
from .rest.transaction import (
     Transaction, 
     TransactionDetail, 
     TransactionCompany, 
     TransactionSalesperson,
     DailyTransaction, 
     TransactionFilter,
     DailyTransactionFilter, 
     TransactionConfirmation
)
from .rest.api import depositHistory
from .task import sendBankReport
from .lang import language_switch


urlpatterns = [
    path('switch-language/',language_switch,name='language-switch'),
    path('404/', views.test404),

    path('test-email/', views.testEmail),

    # pages urls
    path('', views.dashboard_main),
    path('wallet/', views.wallet),
    path('managerial-reports/', views.managerial_reports),
    path('payone-Employee/', views.payone_Employee),
    path('bank-operator/', views.bank_operator),
    path('companies/', views.companies),
    path('prospects/', views.prospects),
    path('prospect-application/<int:id>', digital.prospect_application),
    path('prospect-document/<int:id>', digital.prospect_document.as_view()),
    path('company-details/<int:id>', views.company_details),
    path('managers/', views.managers),
    path('salespersons/', views.salespersons),
    path('general-wallet/', views.general_wallet),
    path('deposit-history/', views.deposit_history),
    path('companies-reports/', views.companies_reports),
    path('managers-reports/', views.managers_reports),
    path('salespersons-reports/', views.salespersons_reports),
    path('daily-reports/', views.bank_report),
    path('report-bank/',views.bank_report),
    path('log-history/',views.log_history),
    path('users/',views.users),
    path('profile/',views.profile),
    path('accounting/',views.accounting),

    # api urls
    
    path('user/<int:id>', UserActivation.as_view()),
    path('user-link/<int:id>', UserPasswordLink.as_view()),
    path('ip/<str:ip>', IpBlock.as_view()),

    path('company', Company.as_view()),
    path('company/<int:id>', CompanyDetail.as_view()),
    path('company-all', AllCompany.as_view()),
    path('commission-types', CommissionType.as_view()),
     
    path('prospect', Prospect.as_view()),
    path('prospect/<int:id>', ProspectDetail.as_view()),


    path('salesperson', Salesperson.as_view()),
    path('salesperson/<int:id>', SalespersonDetail.as_view()),
    path('salesperson-company/<int:id>', SalespersonCompany.as_view()),
    path('salesperson-all', AllSalesperson.as_view()),

    path('employee', Employee.as_view()),
    path('employee/<int:id>', EmployeeDetail.as_view()),
    path('employee-all', AllEmployee.as_view()),

    path('bank-operator', BankOperator.as_view()),
    path('bank-operator/<int:id>', BankOperatorDetail.as_view()),
    path('bank-operator-all', AllBankOperator.as_view()),

    path('manager', Manager.as_view()),
    path('manager/<int:id>', ManagerDetail.as_view()),
    path('manager-company/<int:id>', ManagerCompany.as_view()),
    path('manager-all', AllManager.as_view()),

    path('transaction', Transaction.as_view()),
    path('transaction/<int:id>', TransactionDetail.as_view()),
    path('transaction-company/<int:id>', TransactionCompany.as_view()),
    path('transaction-salesperson/<int:id>', TransactionSalesperson.as_view()),
    path('transaction-daily', DailyTransaction.as_view()),
    path('transaction-query/', TransactionFilter.as_view(),name='transaction-query'),
    path('daily-transaction-query/', DailyTransactionFilter.as_view(),name='daily-transaction-query'),
    

    path('download-file/<str:fileName>/<str:companyId>',
         files.CompanyFile.as_view()),
    path('delete-file/<str:fileName>/<str:companyId>',
         files.CompanyFile.as_view()),

    path('bank-report-file/<str:fileName>/',
         files.BankReportFileDetail.as_view()),
    path('bank-report-file/',
         files.BankReportFile.as_view()),
    
    path('transaction-report-excel/<str:date>', files.transactionExcel),
    path('transaction-report-txt/<str:date>', files.transactionTxt),

    
    path('transaction-action/<int:id>', TransactionConfirmation.as_view(), name='transaction-confirmation'),

    

]
