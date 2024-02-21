from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import CompanyModel,CommissionTypeModel
from ..serializers import CompanySerializer
import os
from django.conf import settings
from django.contrib.auth.models import Group,User
import shutil
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail


class Company(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists() )):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        companies = CompanyModel.objects.filter(status=0).values()
        for company in companies:
            company['commission_type']=CommissionTypeModel.objects.get(id=company['commission_type_id']).description
        return Response(companies, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        data = {
            'company_name': request.data.get('company_name'),
            'owner_name': request.data.get('owner_name'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'commission_rate': request.data.get('commission_rate'),
            'commission_type_id':request.data.get('commission_type_id'),
            'bank_account_no':request.data.get('bank_account_no')
        }
        check = CompanyModel.objects.filter(company_name=data['company_name']).count()
        if check > 0:
            return Response({'A company with this name already exists'}, status=status.HTTP_200_OK )
        serializer = CompanySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            companyId = serializer.data['id']
            company_folder = os.path.join(
                settings.BASE_DIR, 'uploads/companies/company-'+str(companyId))
            os.makedirs(company_folder)
            html_template= get_template('emails/new_company.html')
            context = {
                'subject':'New Company has been created',
                'company':data['company_name'],
                'owner_name':data['owner_name'],
                'email':data['email'],
                'phone':data['phone'],
                'address':data['address'],
                'commission_rate':data['commission_rate']
            }
            html_content = html_template.render(context)
            from_email = settings.EMAIL_HOST_USER
            recipient_list = ['nael.alyousefi@gmail.com']
            plain_message = strip_tags(html_content)
            send_mail(
                context['subject'],
                plain_message,
                from_email,
                recipient_list,
                html_message=html_content,
                fail_silently=False,
            )
            return Response({"Company succesfully created"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, id):
        try:
            return CompanyModel.objects.get(id=id)
        except CompanyModel.DoesNotExist:
            return None

    def get(self, request, id, *args, **kwargs):
        #if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists() )):
            #return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        company = CompanyModel.objects.get(id=id)
        if not company:
            return Response(
                {"res": "Object with Company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        company = CompanyModel.objects.get(id=id)
        if not company:
            return Response(
                {"res": "Object with company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        commission_rate = CompanyModel.objects.get(id=id).commission_rate
        data = {
            'company_name': request.data.get('company_name'),
            'owner_name': request.data.get('owner_name'),
            'email': request.data.get('email'),
            'commission_rate': request.data.get('commission_rate'),
            'address': request.data.get('address'),
            'phone': request.data.get('phone'),
            'bank_account_no':request.data.get('bank_account_no')
        }
        if commission_rate != data['commission_rate']:
            html_template= get_template('emails/commission_rate_update.html')
            context = {
                'subject':'Commission Rate Updated',
                'commission_rate':data['commission_rate'],
                'company':CompanyModel.objects.get(id=id).company_name
            }
            html_content = html_template.render(context)
            from_email = settings.EMAIL_HOST_USER
            recipient_list = ['ediz@scanyoursecurity.com']
            plain_message = strip_tags(html_content)
            send_mail(
                context['subject'],
                plain_message,
                from_email,
                recipient_list,
                html_message=html_content,
                fail_silently=False,
            )
        serializer = CompanySerializer(
            instance=company, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        company = CompanyModel.objects.get(id=id)
        if not company:
            return Response(
                {"res": "Object with company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'status': 1
        }
        serializer = CompanySerializer(
            instance=company, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            company_folder = os.path.join(
                settings.BASE_DIR, 'uploads/companies/company-'+str(company.id))
            os.rmdir(company_folder)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AllCompany(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists() )):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        companies = CompanyModel.objects.filter()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
