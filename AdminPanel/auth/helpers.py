from django.core.mail import send_mail
from django.conf import settings


def sendEmail(toEmail, subject, message):
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [toEmail]
    send_mail(subject, message, from_email, recipient_list)
