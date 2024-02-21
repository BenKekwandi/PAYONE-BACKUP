from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import TransactionModel, SalespersonModel, CompanyModel, ManagerModel
from ..serializers import TransactionSerializer
import datetime
from django.forms.models import model_to_dict
from django.db.models import Q



class DailyTransaction(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        #transactions = list(TransactionModel.objects.filter(
            #transaction_status=1).values())
        transactions=[]
        for trans in TransactionModel.objects.filter(transaction_status=1).values():
            if datetime.datetime.fromtimestamp(float(trans['start_timestamp'])).date() == datetime.datetime.now().date():
                transactions.append(trans)
        
        if(request.user.groups.filter(name='Manager').exists()):
            transactions=[]
            managerCompanyId = ManagerModel.objects.get(user_id=request.user.id).company_id
            salespersons = SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).values()
            for salesperson in salespersons:
                trxs = list(TransactionModel.objects.filter(salesperson_id=salesperson['id'],transaction_status=1).values())
                for trx in trxs:
                    if datetime.datetime.fromtimestamp(float(trx['start_timestamp'])).date() == datetime.datetime.now().date():
                        transactions.append(trx)
        for trx in transactions:
            salesperson = SalespersonModel.objects.get(
                id=trx['salesperson_id'])
            company = CompanyModel.objects.get(id=salesperson.company_id)
            trx['salesperson'] = salesperson.name+' '+salesperson.surname
            trx['company'] = company.company_name
            trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
        return Response(transactions, status=status.HTTP_200_OK)

class Transaction(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        transactions = list(TransactionModel.objects.filter(
            transaction_status=1).values())
        if(request.user.groups.filter(name='Manager').exists()):
            transactions=[]
            managerCompanyId = ManagerModel.objects.get(user_id=request.user.id).company_id
            salespersons = SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).values()
            for salesperson in salespersons:
                trxs = list(TransactionModel.objects.filter(salesperson_id=salesperson['id'],transaction_status=1).values())
                for trx in trxs:
                    transactions.append(trx)
        for trx in transactions:
            salesperson = SalespersonModel.objects.get(
                id=trx['salesperson_id'])
            company = CompanyModel.objects.get(id=salesperson.company_id)
            trx['salesperson'] = salesperson.name+' '+salesperson.surname
            trx['company'] = company.company_name
            trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
        return Response(transactions, status=status.HTTP_200_OK)


class TransactionDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

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


class TransactionSalesperson(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        transactions = list(TransactionModel.objects.filter(
            salesperson_id=id,transaction_status=1).values())
        if not transactions:
            return Response(
                {"res": "Object with Transaction id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(transactions, status=status.HTTP_200_OK)


class TransactionCompany(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        salespersons = list(
            SalespersonModel.objects.filter(company_id=id).values())
        companyTransactions = []
        for salesperson in salespersons:
            salespersonTransactions = list(TransactionModel.objects.filter(
                salesperson_id=salesperson['id'],transaction_status=1).values())
            for trx in salespersonTransactions:
                trx['company'] = CompanyModel.objects.get(id=id).company_name
                slperson = SalespersonModel.objects.get(id=salesperson['id'])
                trx['salesperson'] = slperson.name+' '+slperson.surname
                trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
                companyTransactions.append(trx)
        return Response(companyTransactions, status=status.HTTP_200_OK)
    

class AllTransactions(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        transactions = list(TransactionModel.objects.filter().values())
        if(request.user.groups.filter(name='Manager').exists()):
            transactions=[]
            managerCompanyId = ManagerModel.objects.get(user_id=request.user.id).company_id
            salespersons = SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).values()
            for salesperson in salespersons:
                trxs = list(TransactionModel.objects.filter(salesperson_id=salesperson['id'],transaction_status=1).values())
                for trx in trxs:
                    transactions.append(trx)
        for trx in transactions:
            salesperson = SalespersonModel.objects.get(
                id=trx['salesperson_id'])
            company = CompanyModel.objects.get(id=salesperson.company_id)
            trx['salesperson'] = salesperson.name+' '+salesperson.surname
            trx['company'] = company.company_name
            #trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
        return Response(transactions, status=status.HTTP_200_OK)
    
    
class TransactionFilter(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        salesperson_id = request.GET.get('salesperson_id')
        company_id = request.GET.get('company_id')
        coin = request.GET.get('coin')
        transaction_status = request.GET.get('status')
        start_date = datetime.datetime.strptime(request.GET.get('start_date'), "%Y-%m-%d").date()
        end_date = datetime.datetime.strptime(request.GET.get('end_date'),"%Y-%m-%d").date()
        
        print(datetime.datetime.now().date())
        
        query = Q()
        if salesperson_id is not None and salesperson_id != '0':
            query &= Q(salesperson_id=salesperson_id)
        if company_id is not None and company_id != '0':
            query &= Q(company_id=company_id)
        if coin != 'all':
            query &= Q(coin=coin)
        if transaction_status is not None and transaction_status!='2':
            query &= Q(transaction_status=transaction_status)
        print(query)         
        transactions=[]
        all_transactions=[]
        if not query:
            all_transactions = list(TransactionModel.objects.filter().values())
        else:
            all_transactions = list(TransactionModel.objects.filter(query).values())
        for trx in all_transactions:
            trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
            dt = trx['transaction_date']
            if start_date <= dt.date() <= end_date:
                transactions.append(trx)
        for trx in transactions:
            salesperson = SalespersonModel.objects.get(
                id=trx['salesperson_id'])
            company = CompanyModel.objects.get(id=salesperson.company_id)
            trx['salesperson'] = salesperson.name+' '+salesperson.surname
            trx['company'] = company.company_name
            trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
        return Response(transactions, status=status.HTTP_200_OK)
    
    
class DailyTransactionFilter(APIView):
    #permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        salesperson_id = request.GET.get('salesperson_id')
        company_id = request.GET.get('company_id')
        coin = request.GET.get('coin')
        transaction_status = request.GET.get('status')
        query = Q()
        if salesperson_id is not None and salesperson_id != '0':
            query &= Q(salesperson_id=salesperson_id)
        if company_id is not None and company_id != '0':
            query &= Q(company_id=company_id)
        if coin != 'all':
            query &= Q(coin=coin)
        if transaction_status is not None and transaction_status!='2':
            query &= Q(transaction_status=transaction_status)

                
        print(f"Query is {query}")
        
        transactions=[]
        filteredTransactions = []
        if not query:
            filteredTransactions = list(TransactionModel.objects.all().values())
        else:
            filteredTransactions = list(TransactionModel.objects.filter(query).values())
   
        for trx in filteredTransactions:
            if datetime.datetime.fromtimestamp(float(trx['start_timestamp'])).date() == datetime.datetime.now().date():
                transactions.append(trx)
        for trx in transactions:   
            salesperson = SalespersonModel.objects.get(
                id=trx['salesperson_id'])
            company = CompanyModel.objects.get(id=salesperson.company_id)
            trx['salesperson'] = salesperson.name+' '+salesperson.surname
            trx['company'] = company.company_name
            trx['transaction_date'] = datetime.datetime.fromtimestamp(float(trx['start_timestamp']))
        return Response(transactions, status=status.HTTP_200_OK)

class TransactionConfirmation(APIView):
    def put(self, request, id, *args, **kwargs):
        transaction = TransactionModel.objects.get(id=id)
        serializer = TransactionSerializer(transaction, partial=True)
        if serializer.is_valid():
            transaction.update(
                payone_status = request.data.get('value')
            )
            return Response({"Transaction Succesfully confirmed"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)