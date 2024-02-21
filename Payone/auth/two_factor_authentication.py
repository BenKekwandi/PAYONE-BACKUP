from django_otp import devices_for_user
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp import match_token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from django.shortcuts import render, redirect
from django.contrib import messages
from datetime import datetime
from secret.models import AuthLoginModel
import requests
import json
from rest_framework_simplejwt.tokens import RefreshToken
from secret.models import CompanyModel, SalespersonModel



def get_user_totp_device(user, confirmed=None):
        devices = devices_for_user(user, confirmed=confirmed)
        for device in devices:
            if isinstance(device, TOTPDevice):
                return device
            
            
def login(request):
    if request.method =='POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.groups.filter(name='Salesperson').exists():
                request.session['otp_request_user_id']=user.id     
                return redirect('/auth/2fa-otp')
            else:
                messages.error(request, "Only salespersons are allowed here!")
                return redirect('/auth/2fa-login/')
        else:
            messages.error(request, "Hatalı Giriş Yaptınız !")
            return redirect('/auth/2fa-login/')
    return render(request,'secret/login.html')
    
def otp(request):
    if not request.session.get('otp_request_user_id'):
        messages.error(request, "Two factor Authentication failed")
        return redirect('/auth/2fa-login/')
    userId = request.session.get('otp_request_user_id')
    user=User.objects.get(id=userId)
    if request.method=='POST':
        otp_token = request.POST.get('otp')
        salesperson = SalespersonModel.objects.get(user_id=userId)
        company_id = CompanyModel.objects.get(id=salesperson.company_id)
        company_name= company_id.company_name
        device_match = match_token(user=user, token=otp_token)
        if device_match is not None:
           response = requests.get(f"https://ipinfo.io/{request.META.get('HTTP_CF_CONNECTING_IP')}/json")
           if response.status_code == 200:
               public_ip = response.text.strip()
               ip_info = json.loads(public_ip)
               country = ip_info.get("country")
               region = ip_info.get("region")
               authLogin = AuthLoginModel(
               identifier=user.username,
               user_id=user.id,
               login_datetime=datetime.now(),
               ip_address = request.META.get('HTTP_CF_CONNECTING_IP'),
               country=country,
               region=region,
               user_agent=request.META.get('HTTP_USER_AGENT'),
               success=1,
             )
           else:
               authLogin = AuthLoginModel(
               identifier=user.username,
               user_id=user.id,
               login_datetime=datetime.now(),
               ip_address = request.META.get('HTTP_CF_CONNECTING_IP'),
               country=country,
               region=region,
               user_agent=request.META.get('HTTP_USER_AGENT'),
               success=1,
               )
           authLogin.save()
           auth_login(request, user)
           del request.session['otp_request_user_id']
           request.session['company_name']=company_name
           user = user
           print(user)
           refresh = RefreshToken.for_user(user)
           access_token = str(refresh.access_token)
           request.session['access_token'] = access_token
           return redirect('/secret')
        else:
            response = requests.get(f"https://ipinfo.io/{request.META.get('HTTP_CF_CONNECTING_IP')}/json")
            if response.status_code == 200:
                public_ip = response.text.strip()
                ip_info = json.loads(public_ip)
                country = ip_info.get("country")
                region = ip_info.get("region")
                authLogin = AuthLoginModel(
                identifier=user.username,
                user_id=user.id,
                login_datetime=datetime.now(),
                ip_address = request.META.get('HTTP_CF_CONNECTING_IP'),
                country=country,
                region=region,
                user_agent=request.META.get('HTTP_USER_AGENT'),
                success=0
                )
            else:
               authLogin = AuthLoginModel(
               identifier=user.username,
               user_id=user.id,
               login_datetime=datetime.now(),
               ip_address = request.META.get('HTTP_CF_CONNECTING_IP'),
               country=country,
               region=region,
               user_agent=request.META.get('HTTP_USER_AGENT'),
               success=1,
               )
            authLogin.save()  
            messages.error(request, "Invalid One-Time-Password")
    return render(request,'auth/otp.html')

