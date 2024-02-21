from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from .models import CompanyModel, SalespersonModel
from .models import TransactionModel
from django.contrib import messages
from django.conf import settings
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail
import datetime
import qrcode
from io import BytesIO
import base64 
from datetime import datetime
from .forms import CaptchaForm
from .models import ProspectModel
from auth.two_factor_authentication import get_user_totp_device
from .email import sendMail
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Create your views here.


# authentication
# def loginPage(request):
#     return render(request, 'secret/login.html')

# Landing Pages Routes


def homePage(request):
    return render(request, 'landing_pages/home.html')


def privacyPolicy(request):
    return render(request, 'landing_pages/privacy_policy.html')


def aboutUs(request):
    return render(request, 'landing_pages/about_us.html')


def application(request):
    form=CaptchaForm()
    if request.method=='POST':
        form = CaptchaForm(request.POST)
        if form.is_valid():
            prospectModel = ProspectModel()
            prospectModel.company_name = request.POST.get('company_name')
            prospectModel.address = request.POST.get('company_address')
            prospectModel.contact_person = request.POST.get('contact_person')
            prospectModel.business_registration_number = request.POST.get('registration_number')
            prospectModel.country = request.POST.get('country')
            prospectModel.city = request.POST.get('city')
            prospectModel.post_code = request.POST.get('postal_code')
            prospectModel.website = request.POST.get('website')
            prospectModel.email = request.POST.get('email')
            prospectModel.phone = request.POST.get('phone')
            prospectModel.save()
            sendMail(
                'REQUEST APPLICATION SUCCESFULL',
                settings.EMAIL_HOST_USER,
                [request.POST.get('email')],
                'emails/prospect_application.html', 
                {})
            sendMail(
                'NEW PROSPECT REQUEST APPLICATION',
                settings.EMAIL_HOST_USER,
                ['arekanteknoloji@gmail.com'],
                'emails/prospect.html', 
                {
                    'company_name':request.POST.get('company_name'),
                    'company_address':request.POST.get('company_address'),
                    'contact_person':request.POST.get('contact_person'),
                    'registration_datetime': datetime.now()
                })
            return redirect('/')
        else:
            messages.error(request,"Captcha failed, please try again")
    return render(request, 'landing_pages/application.html',{'form':form})

def contactUs(request):
    print('Before submission')
    if request.method == 'POST':
        print('after submission')
        html_template_user= get_template('emails/contact_user.html')
        context = {
            'message':request.POST.get('message'),
            'email':request.POST.get('email'),
            'subject':request.POST.get('subject'),
            'name':request.POST.get('name'),
            'dateTime':datetime.now()
        }
        user_html_content = html_template_user.render(context)
        user_email_subject = request.POST.get('subject')
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [request.POST.get('email')]
        plain_message = strip_tags(user_html_content)
        send_mail(
            user_email_subject,
            plain_message,
            from_email,
            recipient_list,
            html_message=user_html_content,
            fail_silently=False,
        )
        
        system_html_template= get_template('emails/contact_payone.html')
        system_html_content = system_html_template.render(context)
        system_email_subject = request.POST.get('subject')
        receiver= ['info@payone.com.tr']
        system_message = strip_tags(user_html_content)
        send_mail(
            system_email_subject,
            system_message,
            from_email,
            receiver,
            html_message=system_html_content,
            fail_silently=False,
        )
        
    return render(request, 'landing_pages/contact_us.html')

def useOfTerms(request):
    return render(request, 'landing_pages/use_terms.html')


def FAQ(request):
    return render(request, 'landing_pages/faq.html')


def ourServices(request):
    return render(request, 'landing_pages/our_services.html')

def ourPartner(request):
    return render(request, 'landing_pages/our_partner.html')

# Secret Pages Routes


@login_required(login_url='/./auth/2fa-login/')
def secret(request):
    user =  request.user
    salesperson = SalespersonModel.objects.get(user_id=request.user.id)
    company = CompanyModel.objects.get(id=salesperson.company_id)
    company_name= company.company_name
    if user is not None:
        if user.groups.filter(name='Salesperson').exists():
            return render(request, 'secret/dashboard.html')
        else:
            messages.error(request, "Only salespersons are allowed here!")
            return redirect('/auth/2fa-login/')
    return redirect('/auth/2fa-login/')
    # return render(request, 'secret/dashboard.html')


@login_required(login_url='/./auth/2fa-login/')
def paymentLink(request):
    salesperson = SalespersonModel.objects.get(user_id=request.user.id)
    company = CompanyModel.objects.get(id=salesperson.company_id)
    commission = company.commission_rate
    commission_type=company.commission_type_id
    data={
        'commission': commission,
        'commission_type':commission_type
    }
    return render(request, 'secret/payment_link.html', {'data': data})


@login_required(login_url='/./auth/2fa-login/')
def history(request):
    return render(request, 'secret/history.html')


@login_required(login_url='/./auth/2fa-login/')
def paymentReports(request):
    return render(request, 'secret/payment_report.html')


@login_required(login_url='/./auth/2fa-login/')
def qrcodes(request, transaction_id):
    transaction = TransactionModel.objects.get(
        pk=transaction_id)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
        )
    qr.add_data(transaction.address)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    image_data = buffer.getvalue()
    buffer.close()
    image_data_base64 = base64.b64encode(image_data).decode('utf-8')
    timestamp = float(transaction.start_timestamp)

    start_datetime = datetime.fromtimestamp(timestamp)

    hours = str(start_datetime.hour + 2)
    minutes = str(start_datetime.minute)
    data = {
        'address' : transaction.address,
        'reference_no' : transaction.id,
        'timestamp' :hours+':'+minutes ,
        'expected_amount' :transaction.expected_amount,
        'expected_crypto' :transaction.expected_crypto,
        'banknote' :transaction.banknote,
        'coin' :transaction.coin,
        'qr_code':image_data_base64,
        'status':transaction.transaction_status,
    }
    return render(request, 'secret/qrcode.html', {'data': data})


@login_required(login_url='/./auth/2fa-login/')
def profile(request):
    salesperson = SalespersonModel.objects.get(user_id=request.user.id)
    company = CompanyModel.objects.get(id=salesperson.company_id)
    commission = company.commission_rate
    commissionType= company.commission_type_id
    fullName = salesperson.name +' '+salesperson.surname
    email =salesperson.email
    phone =salesperson.phone
    device = get_user_totp_device(request.user)
    qr_code = device.config_url
    last_login = request.user.last_login
    parsed_url = urlparse(device.config_url)
    query_params = parse_qs(parsed_url.query)
    secretKey = query_params['secret'][0]
    return render(request, 'secret/profile.html', {'secret':secretKey,'configURL':device.config_url,'commission_type':commissionType,'last_login':last_login,'qr_code':qr_code,'commission': commission,'fullName': fullName,'email': email,'phone': phone})


     