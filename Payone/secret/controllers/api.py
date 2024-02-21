import json
from django.http import JsonResponse
from rest_framework.views import APIView
from ..utils import BinanceAPI
from ..utils import call_crypto_api
from ..utils import call_crypto_apis
from ..models import SalespersonModel
from ..models import TransactionModel
from ..models import CompanyModel
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from ..serializers import TransactionSerializer
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.db.models import Q
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail


class exchangeRates(APIView):
    def get(self, request):
        binance_api = BinanceAPI()

        symbols = ["BTCUSDT", "ETHUSDT", "TRXUSDT", "BTCTRY",
                   "ETHTRY", "TRXTRY", "USDCUSDT", "USDTTRY"]
        endpoint = "/api/v3/ticker/24hr"

        responses = []
        for symbol in symbols:
            params = {"symbol": symbol}
            response = binance_api.apiCall(params, endpoint)
            responses.append(response.json())

        return JsonResponse(responses, safe=False)



class calculator(APIView):
    def get(self, request):
        binance_api = BinanceAPI()

        symbols = ["BTCUSDT", "ETHUSDT", "TRXUSDT", "BTCTRY", "ETHTRY", "TRXTRY", "USDTTRY",
                   "BTCEUR", "ETHEUR", "TRXEUR", "EURUSDT", "BTCGBP", "ETHGBP", "TRXGBP", "GBPUSDT"
                   ]
        endpoint = "/api/v3/ticker/price"

        responses = []
        for symbol in symbols:
            params = {"symbol": symbol}
            response = binance_api.apiCall(params, endpoint)
            responses.append(response.json())
        return JsonResponse(responses, safe=False)



class dipositHistory(APIView):
    def get(self, request):
        endpoint = 'transactions'
        transactions = TransactionModel.objects.filter(~Q(transaction_status = -1) & Q(api_status=None))
        response = call_crypto_apis(endpoint)
        api_data_list = response.json()
        errors = []
        for trans in transactions:
            matching_transactions = [api_trans for api_trans in api_data_list if trans.address == api_trans['to']]
            if matching_transactions:
                for api_data in matching_transactions:
                    existing_transaction = TransactionModel.objects.get(id=trans.id)
                    existing_transaction.api_trans_id = api_data['_id']
                    existing_transaction.insert_timestamp = api_data['confirm_date']
                    existing_transaction.received_crypto = api_data['amount']
                    existing_transaction.api_status = api_data['status']
                    existing_transaction.transaction_status = 1
                    existing_transaction.save()
                    confirmation_email(existing_transaction.id)

        if errors:
           return Response("error", status=status.HTTP_400_BAD_REQUEST)
            
        return Response(status=status.HTTP_200_OK)
    
    
    
def confirmation_email(transactionId):
    transaction = TransactionModel.objects.get(id=transactionId)
    email = SalespersonModel.objects.get(id=transaction.salesperson_id).email
    html_template= get_template('emails/transaction_confirmation.html')
    context = {
        'subject':'Transaction Confirmation',
        'amount':transaction.received_crypto,
        'crypto':transaction.coin,
        'reference_number':transaction.id,
        'company':CompanyModel.objects.get(id=transaction.company_id).company_name
    }
    html_content = html_template.render(context)
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    plain_message = strip_tags(html_content)
    send_mail(
        context['subject'],
        plain_message,
        from_email,
        recipient_list,
        html_message=html_content,
        fail_silently=False,
    )

# class CreateQRCode(APIView):
#     @authentication_classes([JWTAuthentication])
#     @permission_classes([IsAuthenticated])
#     def post(self, request):
#         jwt_token = request.session.get('access_token', None)      
#         decoded_token = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
#         userId = decoded_token['user_id']
#         endpoint = 'wallet'
#         token= request.data.get('coin')
        
#         response = call_crypto_api(token, endpoint)

#         return JsonResponse(response, safe=False)
