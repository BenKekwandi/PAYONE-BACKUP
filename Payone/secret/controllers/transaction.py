from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from django.urls import reverse
from ..models import TransactionModel, CompanyModel, SalespersonModel
from ..serializers import TransactionSerializer
import datetime
from django.utils import timezone
from ..utils import call_crypto_api
from rest_framework import exceptions
from rest_framework import permissions
import jwt


unix_timestamp = 1630687200
datetime_obj = datetime.datetime.fromtimestamp(unix_timestamp)


class Transaction(APIView):
    @authentication_classes([JWTAuthentication])
    @permission_classes([IsAuthenticated])
    def get(self, request, *args, **kwargs):
     try:
        jwt_token = request.session.get('access_token', None)      
        decoded_token = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
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
     except (IndexError, AttributeError):
            raise exceptions.AuthenticationFailed("JWT token not found in request headers")


class TransactionDetail(APIView):
    def get_object(self, id):
        try:
            return TransactionModel.objects.get(id=id)
        except TransactionModel.DoesNotExist:
            return None

    def get(self, request, id, *args, **kwargs):
        transaction = TransactionModel.objects.get(id=id)
        if not transaction:
            return Response(
                {"res": "Object with Transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TransactionCreate(APIView):
    def get(self, request, id, *args, **kwargs):
        transaction = TransactionModel.objects.get(id=id)
        if not transaction:
            return Response(
                {"res": "Object with Transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        jwt_token = request.session.get('access_token', None)      
        decoded_token = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        userId = decoded_token['user_id']
        salesperson = SalespersonModel.objects.get(user_id=userId)
        company=salesperson.company_id
        comp = CompanyModel.objects.get(id=company)
        commission_type_id = comp.commission_type_id
        current_timestamp = timezone.now()
        unix_timestamp = int(current_timestamp.timestamp())

        endpoint = "wallet"
        token = request.data.get('network')
        response = call_crypto_api(token, endpoint)
        
        data = response.json()
        address = data['address']
        data = {
            'expected_amount': request.data.get('expected_amount'),
            'expected_crypto': request.data.get('expected_crypto'),
            'banknote': request.data.get('banknote'),
            'exchange_rate': request.data.get('exchange_rate'),
            'commission_rate': comp.commission_rate,
            'coin': request.data.get('coin'),
            'salesperson_id': salesperson.id,
            'company_id': company,
            'commission_type_id':commission_type_id,
            'network': token,
            'address': address,
            'start_timestamp': unix_timestamp,
            
        }
        serializer = TransactionSerializer(data=data)
        if serializer.is_valid():
            transaction = serializer.save()
            # Redirect to 'qrcode' view
            redirect_url = reverse(
                'qrcode', kwargs={'transaction_id': transaction.id})
            return Response({'redirect_url': redirect_url})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, request, *args, **kwargs):
        if(not request.user.groups.filter(name='Salesperson').exists()):
            return Response({"error: How did you reach this page???"}, status=status.HTTP_400_BAD_REQUEST)
        id=request.data.get('id')
        transaction = TransactionModel.objects.get(id=id)
        if not transaction:
            return Response(
                {"res": "Object with Transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'transaction_status': -1
        }
        serializer = TransactionSerializer(
            instance=transaction, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DailyTransaction(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        if not request.user.groups.filter(name='Salesperson').exists():
            Response({'User is not a salesperson'}, status=status.HTTP_200_OK)
        transactions=[]
        salespersonId = SalespersonModel.objects.get(user_id = request.user.id).id
        for trans in TransactionModel.objects.filter(transaction_status=1,salesperson_id =salespersonId).values():
            if datetime.datetime.fromtimestamp(float(trans['start_timestamp'])).date() == datetime.datetime.now().date():
                transactions.append(trans)
        for trx in transactions:
            salesperson = SalespersonModel.objects.get(
                id=trx['salesperson_id'])
            company = CompanyModel.objects.get(id=salesperson.company_id)
            trx['salesperson'] = salesperson.name+' '+salesperson.surname
            trx['company'] = company.company_name
            trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
        return Response({f"REQUEST USER ID: {request.user.id}"}, status=status.HTTP_200_OK)