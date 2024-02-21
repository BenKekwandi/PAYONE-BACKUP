from . import views
from django.urls import path

urlpatterns = [

    path('auth/check/user', views.login, name='user-check-login'),
    path('auth/check/email', views.verifyEmail, name='user-check-email'),
    path('auth/check/2fa-otp', views.otp, name='user-check-auth'),
    path('user/info/user-profile', views.userProfile, name='user-profile'),
    path('user/info/user-commission', views.commissionRate, name='user-commission'),
    path('user/info/user-transactions', views.Transactions, name='user-transactions'),
    path('capital/transac/deposit/wallet', views.TransactionWallet, name='transaction-make-wallet'),
    path('capital/transac/cancel/wallet', views.cancelWallet, name='transaction-cancel-wallet'),
]