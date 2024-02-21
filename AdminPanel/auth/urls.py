from django.contrib import admin
from django.urls import path, include
from .views import *
from django.contrib.auth.views import LogoutView
from .two_factor_authentication import login, otp

app_name = 'auth'

urlpatterns = [
    #path('login/', login_view),
    path('login/', login),
    path('logout/', LogoutView.as_view()),
    path('salesperson-redirect',salesperson_redirect),
    #path('otp/', otp_view),
    path('email/', verify_email),
    path('inbox/', check_inbox),
    path('forget-password/<str:token>/',forget_password, name="forget_password"),
    path('404/', handle404),
    path('2fa-login/',login),
    path('2fa-otp/', otp),
    path('2fa-reset-otp/<str:token>/', resetOTP)
]
