from django.urls import reverse
from django.views.generic import TemplateView
from django.contrib.auth.views import LogoutView
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.views.generic import View
from .utils import send_otp
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group, User
import pyotp
from datetime import datetime, timedelta
import uuid
from .helpers import sendEmail
from panel.models import AuthPasswordTokenModel, AuthLoginModel
from django_otp import devices_for_user
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp import match_token
from .two_factor_authentication import get_user_totp_device


class LoginView(LoginView):
    template_name = 'auth/login.html'


def login_view(request):
    if request.method == 'POST':
        usname = request.POST.get("username")
        pw = request.POST.get("password")
        user = authenticate(request, username=usname, password=pw)
        if user is not None:
            if user.groups.filter(name='Salesperson').exists():
                messages.error(
                    request, "Salespersons are not allowed to log in the Admin system")
                authLogin = AuthLoginModel(
                    identifier=usname,
                    login_datetime=datetime.now(),
                    ip_address=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT'),
                    success=0
                )
                authLogin.save()
            else:
                request.session['username'] = usname
                send_otp(request, user.email)
                if(request.session.get('otp_secret_key')!=None and request.session.get('otp_valid_date')!=None):
                    return redirect('/auth/otp')
                else:
                    messages.error(
                    request, "Two Factor Authentication Failed, Try again!")
                    return redirect('/auth/login')          
        else:
            authLogin = AuthLoginModel(
                identifier=usname,
                login_datetime=datetime.now(),
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT'),
                success=0
            )
            authLogin.save()
            messages.error(request, "Wrong Credentials!!!")
    return render(request, 'auth/login.html')


def otp_view(request):
    if request.method == 'POST':
        otp = request.POST['otp']
        username = request.session['username']
        otp_secret_key = request.session['otp_secret_key']
        otp_valid_until = request.session['otp_valid_date']

        if otp_secret_key and otp_valid_until is not None:
            valid_until = datetime.fromisoformat(otp_valid_until)
            if valid_until > datetime.now():
                totp = pyotp.TOTP(otp_secret_key, interval=60)
                if totp.verify(otp):
                    user = get_object_or_404(User, username=username)
                    login(request, user)
                    authLogin = AuthLoginModel(
                        identifier=user.username,
                        user_id=user.id,
                        login_datetime=datetime.now(),
                        ip_address=request.META.get('REMOTE_ADDR'),
                        user_agent=request.META.get('HTTP_USER_AGENT'),
                        success=1
                    )
                    authLogin.save()
                    del request.session['otp_secret_key']
                    del request.session['otp_valid_date']
                    return redirect('/')
                else:
                    messages.error(request, "Invalid One-Time-Password")
            else:
                messages.error(request, "One-Time-Password expired")
        else:
            messages.error(request, "Oops something went wrong")
    return render(request, 'auth/otp.html', {})