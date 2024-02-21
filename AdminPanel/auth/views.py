from django.urls import reverse
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from datetime import datetime
from django.contrib.auth.models import Group, User
from datetime import datetime, timedelta
import uuid
from .helpers import sendEmail
from panel.models import AuthPasswordTokenModel
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp import match_token
from .two_factor_authentication import get_user_totp_device
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.contrib.auth.password_validation import validate_password
import re
from urllib.parse import urlparse, parse_qs


def verify_email(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, "Email not found")
            return render(request, 'auth/email.html', {})
        token = str(uuid.uuid4())
        authPasswordToken = AuthPasswordTokenModel()
        authPasswordToken.token_string = token
        authPasswordToken.user_id = user.id
        authPasswordToken.expiration_date = datetime.now() + timedelta(minutes=15)
        authPasswordToken.save()
        reset_link = settings.BASE_URL+reverse('auth:forget_password', args=[token])
        html_template = get_template('emails/password_link.html')
        context = {
            'reset_link': reset_link
        }
        html_content = html_template.render(context)
        email_subject = 'Reset Password'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]
        plain_message = strip_tags(html_content)

        send_mail(
            email_subject,
            plain_message,
            from_email,
            recipient_list,
            html_message=html_content,
            fail_silently=False,
        )
        return redirect('/auth/inbox/')
    return render(request, 'auth/email.html', {})

def check_inbox(request):
    return render(request, 'auth/inbox.html', {})

def resetOTP(request,token):
    try:
        password_token = AuthPasswordTokenModel.objects.get(token_string=token)
    except AuthPasswordTokenModel.DoesNotExist:
        print('Token does not even exist')
        return redirect('/auth/404/')
    password_token = AuthPasswordTokenModel.objects.get(token_string=token)
    if password_token:
        valid_date = password_token.expiration_date
        if valid_date < datetime.now():
            messages.error(request, 'Token already expired')
            return redirect('/auth/404/')
    else:
        messages.error(request, 'Invalid Password Token')
        return redirect('/auth/404/')
    user = User.objects.get(id=password_token.user_id)
    device = get_user_totp_device(user)
    if not device:
        device = user.totpdevice_set.create(confirmed=True)
    qr_code = device.config_url
    parsed_url = urlparse(device.config_url)
    query_params = parse_qs(parsed_url.query)
    secretKey = query_params['secret'][0]
    if request.method == 'POST':
        otp = request.POST['otp']
        device_match = match_token(user=user, token=otp)
        if device_match is not None:
            messages.error(request, 'Password successfully reset')
            if user.groups.filter(name='Salesperson').exists(): 
                return redirect('/auth/salesperson-redirect')
            return redirect('/auth/login/')
        else:
            messages.error(request, 'Invalid OTP, try again')
            return redirect('/auth/2fa-reset-otp/'+token)
    return render(request,'auth/reset_otp.html',{'qr_code':qr_code,'secret':secretKey})


def forget_password(request, token):
    pattern = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&^&*()[\]{}|:;,<>.?/~`_\-+=])[\w@#$!%*?&^&*()[\]{}|:;,<>.?/~`_\-+=]{8,}$'
    try:
        password_token = AuthPasswordTokenModel.objects.get(token_string=token)
    except AuthPasswordTokenModel.DoesNotExist:
        print('Password Token does not even exist')
        return redirect('/auth/404/')
    password_token = AuthPasswordTokenModel.objects.get(token_string=token)
    if password_token:
        valid_date = password_token.expiration_date
        if valid_date < datetime.now():
            messages.error(request, 'Password Token already expired')
            return redirect('/auth/404/')
    else:
        messages.error(request, 'Invalid Password Token')
        return redirect('/auth/404/')
    if request.method == 'POST':
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        if not re.match(pattern, password):
            messages.error(request, '''Password must be at least 8 characters long and contain at least one uppercase letter, 
            one lowercase letter, one digit, and one of the following special characters:
            @, #, $, !, %, *, ?, &, ^, (, ), [, ], {, }, |, :, ;, ,, <, >, ., /, ~, `, _, +, and -.''')
            return redirect('/auth/forget-password/'+token)
        if password == confirm_password:
            user = User.objects.get(id=password_token.user_id)
            user.password = make_password(password)
            user.save()
            device = get_user_totp_device(user)
            if device == None:
                device = user.totpdevice_set.create(confirmed=True)
            else:
                device.delete()
                device = user.totpdevice_set.create(confirmed=True)
            return redirect('/auth/2fa-reset-otp/'+token)
        else:
            messages.error(request, 'Passwords are not matching')
    return render(request, 'auth/password.html')

def salesperson_redirect(request):
    return render(request, 'auth/redirect.html')



def handle404(request):
    return render(request, 'auth/404.html')
