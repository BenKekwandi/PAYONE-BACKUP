from django.urls import path, reverse, include
from . import views
from .lang import language_switch
from .controllers.api import *
from .controllers.transaction import *
from .controllers.log_histroy import *


urlpatterns = [


    # authentication
    # path('login', views.loginPage, name='login'),
    # path("__debug__/", include("debug_toolbar.urls")),
    path('switch-language/',language_switch, name='language-switch'),

    # Landing Pages urls
    path('', views.homePage, name='home'),

    path('privacy-policy', views.privacyPolicy, name='privacy-policy'),

    path('about-us', views.aboutUs, name='about-us'),

    path('contact-us', views.contactUs, name='contact-us'),

    path('terms-of-use', views.useOfTerms, name='terms-of-use'),

    path('faq', views.FAQ, name='faq'),

    path('our-services', views.ourServices, name='our-services'),

    path('our-partner', views.ourPartner, name='our-partner'),
    
    path('application', views.application, name='new-application'),


    # Secret Routes
    path('secret', views.secret, name='secret'),

    path('transaction-history', views.history, name='transaction-history'),

    path('payment-transaction', views.paymentLink, name='payment-transaction'),

    path('payment-report', views.paymentReports, name='payment-report'),

    path('account-info', views.profile, name='account-info'),

    path('generate-code', TransactionCreate.as_view(), name='generate-code'),

    path('qrcode/<int:transaction_id>/', views.qrcodes, name='qrcode'),


    # api
    
    path('exchange-rate', exchangeRates.as_view(), name='exchange-rate'),

    path('exchange-price', calculator.as_view(), name='exchange-price'),

    path('deposit-history', dipositHistory.as_view(), name='deposit-history'),
    
    #path('daily-transactions', DailyTransaction.as_view(), name='daily-transactions'),

    path('transactions', Transaction.as_view(), name='transactions'),

    path('log-history', LogHistory.as_view(), name='log-history'),

    # path('test', views.test, name='test'),

]


    