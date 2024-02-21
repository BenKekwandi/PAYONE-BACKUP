from django.core.mail import send_mail
import uuid
from django.contrib.auth.models import Group, User
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.conf import settings
from datetime import datetime, timedelta
from panel.models import AuthPasswordTokenModel
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail


def sendEmail(toEmail, subject, message):
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [toEmail]
    send_mail(subject, message, from_email, recipient_list)


def create_user(userData, userGroup):
    userData['password'] = make_password('admin@1234')
    group = Group.objects.get(name=userGroup)
    user = User.objects.create(**userData)
    user.groups.add(group)
    return user

def sendPasswordLink(request, user):
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
    try:
        send_mail(
            email_subject,
            plain_message,
            from_email,
            recipient_list,
            html_message=html_content,
            fail_silently=False,
        )
    except Exception as e:
        print(f"An error occurred while sending password reset email: {e}\n")
