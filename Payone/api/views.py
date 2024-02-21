from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from django_otp import match_token
from secret.models import AuthLoginModel
from datetime import timedelta,datetime
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.views.decorators.http import require_POST
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from secret.models import SalespersonModel, CompanyModel,TransactionModel, CommissionTypeModel
from django.utils import timezone
from secret.serializers import TransactionSerializer
import jwt
from django.conf import settings
import requests
import json
from django.http import JsonResponse
from secret.utils import call_crypto_api
import uuid
from secret.models import AuthPasswordTokenModel
from django_otp import match_token
from auth.two_factor_authentication import get_user_totp_device
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.urls import reverse



@api_view(['POST'])
@require_POST
@permission_classes([permissions.AllowAny])
def login(request):
   if request.method == 'POST':
        if 'username' in request.data and 'password' in request.data:
            username = request.data.get('username')
            password = request.data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.groups.filter(name='Salesperson').exists():

                    auth_login(request, user)

                    access_token = AccessToken.for_user(user)
                    access_token.set_exp(int(timedelta(minutes=120).total_seconds()))  
                    
                    refresh = RefreshToken.for_user(user)
                    refresh_token = str(refresh)

                    response_data = {
                        'access_token': str(access_token),
                        # 'refresh_token': refresh_token
                    }
                    
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Only salesperson can login'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)   
        
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
   return Response({'error': 'Invalid Method'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@require_POST
@permission_classes([permissions.AllowAny])
def otp(request):
    # renderer_classes = [renderers.JSONRenderer]
    if request.method == 'POST':
        authorization_header = request.META.get('HTTP_AUTHORIZATION', '')

        token = authorization_header.split('Bearer ')[1]
        
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        userId = decoded_token['user_id']    
        user=User.objects.get(id=userId)
        if request.method=='POST':
            otp_token = request.data.get('otp')
            device_match = match_token(user=user, token=otp_token)      
            if device_match is not None:
                response = requests.get('https://ipinfo.io')
                if response.status_code == 200:
                    public_ip = response.text.strip()
                    ip_info = json.loads(public_ip)
                    country = ip_info.get("country")
                    region = ip_info.get("region")
                    authLogin = AuthLoginModel(
                    identifier=user.username,
                    user_id=user.id,
                    login_datetime=datetime.now(),
                    ip_address=request.META.get('REMOTE_ADDR'),
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
                    ip_address=request.META.get('REMOTE_ADDR'),
                    country=country,
                    region=region,
                    user_agent=request.META.get('HTTP_USER_AGENT'),
                    success=1,
                    )
                authLogin.save()
                return Response('Success', status=status.HTTP_200_OK)
            else:
                response = requests.get('https://ipinfo.io')
                if response.status_code == 200:
                    public_ip = response.text.strip()
                    ip_info = json.loads(public_ip)
                    country = ip_info.get("country")
                    region = ip_info.get("region")
                    authLogin = AuthLoginModel(
                    identifier=user.username,
                    user_id=user.id,
                    login_datetime=datetime.now(),
                    ip_address=request.META.get('REMOTE_ADDR'),
                    country=country,
                    region=region,
                    user_agent=request.META.get('HTTP_USER_AGENT'),
                    success=0
                    )
            return Response('Failed', status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'error': 'Invalid Method'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@require_POST    
def verifyEmail(request):
    if request.method == 'POST':
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error":"The email entered doesn't exist in the system"}, status=status.HTTP_400_BAD_REQUEST)
        if not user.groups.filter(name='Salesperson').exists():
            return JsonResponse({"error":"The user is not registered in the system as a salesperson"}, status=status.HTTP_400_BAD_REQUEST)
        token = str(uuid.uuid4())
        authPasswordToken = AuthPasswordTokenModel()
        authPasswordToken.token_string = token
        authPasswordToken.user_id = user.id
        authPasswordToken.expiration_date = datetime.now() + timedelta(minutes=15)
        authPasswordToken.save()
        reset_link = settings.BASE_URL+reverse('auth:forget_password', args=[token])
        html_template = get_template('emails/reset_password.html')
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
        return Response({"success":"The reset password link has been succesfully sent to user"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@require_POST
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def TransactionWallet(request):
    if request.method == 'POST':
        current_timestamp = timezone.now()
        unix_timestamp = int(current_timestamp.timestamp())
        authorization_header = request.META.get('HTTP_AUTHORIZATION', '')
        token = authorization_header.split('Bearer ')[1]

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            userId = decoded_token['user_id']
            salesperson = SalespersonModel.objects.get(user_id=userId)
            company=salesperson.company_id
        except (jwt.ExpiredSignatureError, jwt.DecodeError, SalespersonModel.DoesNotExist):
           pass
       
        endpoint = "wallet"
        token = request.data.get('network')
        response = call_crypto_api(token, endpoint)
        data = response.json()
        address = data.get('address')
        comp = CompanyModel.objects.get(id=salesperson.company_id)
        transaction_data = {
            'commission_type_id':comp.commission_type_id,
            'expected_amount': request.data.get('expected_amount'),
            'expected_crypto': request.data.get('expected_crypto'),
            'banknote': request.data.get('banknote'),
            'exchange_rate': request.data.get('exchange_rate'),
            'commission_rate': request.data.get('commission_rate'),
            'coin': request.data.get('coin'),
            'salesperson_id': salesperson.id,
            'address': address,
            'network':token,
            'start_timestamp': unix_timestamp,
            'company_id': company,
        }
        serializer = TransactionSerializer(data=transaction_data)
        if serializer.is_valid():
            transaction=serializer.save()
            transaction_data['transaction_id'] = transaction.id
            return JsonResponse(transaction_data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({'error': 'Invalid Method'}, status=status.HTTP_400_BAD_REQUEST)
     
     
     
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def userProfile(request):
    if request.method == 'GET':
        authorization_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        token = authorization_header.split('Bearer ')[1]
        
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        userId = decoded_token['user_id']    
        salesperson = SalespersonModel.objects.get(user_id=userId)
        company= CompanyModel.objects.get(id=salesperson.company_id)
        response={
            'name':salesperson.name + salesperson.surname,
            'email':salesperson.email,
            'phone':salesperson.phone,
            'address':salesperson.address,
            'company':company.company_name,
        }
    return Response(response, status=200)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def commissionRate(request):
    if request.method == 'GET':
        authorization_header = request.META.get('HTTP_AUTHORIZATION', '')
        token = authorization_header.split('Bearer ')[1]
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        userId = decoded_token['user_id']    
        salesperson = SalespersonModel.objects.get(user_id=userId) 
        company= CompanyModel.objects.get(id=salesperson.company_id)
        commission = company.commission_rate
        commissionType = 'not-included' if company.commission_type_id == 1 else 'included' if company.commission_type_id == 2 else ''
        response={
            'commission':commission,
            'commission_type':commissionType,
        }
    return Response(response, status=200)


@api_view(['POST'])
@require_POST
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def cancelWallet(request):
    if request.method == 'POST':
        transaction = TransactionModel.objects.get(address=request.data.get('wallet'))
        data = {
            'transaction_status': -1
        }
        serializer = TransactionSerializer(
            instance=transaction, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else: 
     return JsonResponse({'error': 'Invalid Method'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Transactions(request):
    if request.method == 'GET':
        authorization_header = request.META.get('HTTP_AUTHORIZATION', '')
        token = authorization_header.split('Bearer ')[1]
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        userId = decoded_token['user_id']    
        salesperson = SalespersonModel.objects.get(user_id=userId) 
        transactions = TransactionModel.objects.filter(
           salesperson_id=salesperson.id).values()
        transDict = list(transactions)
        for trx in transDict:
            salesperson = SalespersonModel.objects.get(
                id=trx['salesperson_id'])
            company = CompanyModel.objects.get(id=salesperson.company_id)
            trx['salesperson'] = salesperson.name+' '+salesperson.surname
            trx['company'] = company.company_name
        # serializer = TransactionSerializer(transDict, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(transDict, status=status.HTTP_200_OK)
    else: 
     return JsonResponse({'error': 'Invalid Method'}, status=status.HTTP_400_BAD_REQUEST)