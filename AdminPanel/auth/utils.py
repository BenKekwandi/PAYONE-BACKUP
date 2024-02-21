import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail
import uuid
from django.contrib.auth.models import Group, User
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.conf import settings

def sendEmail(toEmail, subject, message):
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [toEmail]
    send_mail(subject, message, from_email, recipient_list)


def send_otp(request, toEmail):
    totp = pyotp.TOTP(pyotp.random_base32(), interval=60)
    otp = totp.now()
    request.session['otp_secret_key'] = totp.secret
    print(request.session['otp_secret_key'])
    valid_date = datetime.now() + timedelta(minutes=10)
    request.session['otp_valid_date'] = str(valid_date)
    subject = 'OTP two-factor authentication'
    message = f"You one Time Password is {otp}"
    print(f"Here is the OTP: {otp}")
    try:
        sendEmail(toEmail, subject, message)
        print("OTP sent successfully")
    except Exception as e:
        print(f"An error occurred while sending OTP email: {e}\n")
        print("Failed to send OTP email")

def sendPasswordLink(request, user):
    token = str(uuid.uuid4())
    valid_date = (datetime.now() + timedelta(days=2)
                  ).strftime("%Y-%m-%d %H:%M:%S")
    token_data = {
        'token': token,
        'user_id': user.id,
        'valid_date': valid_date
    }
    request.session['password_token'] = token_data
    reset_link = request.build_absolute_uri(
        reverse('forget_password', args=[token])
    )
    mail = f"Your Password Reset link: {reset_link}"
    try:
        sendEmail(user.email, 'Password Reset Token', mail)
    except Exception as e:
        print(f"An error occurred while sending password reset email: {e}\n")
