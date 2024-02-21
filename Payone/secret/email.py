from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail

def sendMail(subject,fromAddress,recipients,template, context):
    html_template= get_template(template)
    html_content = html_template.render(context)
    message = strip_tags(html_content)
    send_mail(
        subject,
        message,
        fromAddress,
        recipients,
        html_message=html_content,
        fail_silently=False,
    )