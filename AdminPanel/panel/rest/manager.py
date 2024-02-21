from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import ManagerModel, CompanyModel
from django.contrib.auth.models import User, Group
from ..serializers import ManagerSerializer
from django.forms.models import model_to_dict
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from ..helpers import sendPasswordLink

from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.conf import settings

class Manager(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists())):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        managers = list(ManagerModel.objects.filter(status=0).values())
        for manager in managers:
            company = CompanyModel.objects.get(id=manager['company_id'])
            manager['company'] = company.company_name
        return Response(managers, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        userData = {
            'username': request.data.get('email'),
            'first_name': request.data.get('name'),
            'last_name': request.data.get('surname'),
            'email': request.data.get('email')
        }
        check = User.objects.filter(email=userData['email']).count()
        if check > 0:
            return Response({'This email already exists in the system'}, status=status.HTTP_200_OK )
        userData['password'] = make_password('admin@1234')
        group_name = 'Manager'
        group = Group.objects.get(name=group_name)
        user = User.objects.create(**userData)
        user.groups.add(group)
        if not user:
            return Response(
                {"res": "Failed to set the manager as a system User"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.groups.add(group)
        data = {
            'name': request.data.get('name'),
            'surname': request.data.get('surname'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'user_id': user.id,
            'company_id': request.data.get('company_id'),
        }
        company=CompanyModel.objects.get(id=request.data.get('company_id'))
        html_template= get_template('emails/new_manager.html')
        context = {
                'subject':'New Manager has been created',
                'name':data['name'],
                'surname':data['surname'],
                'email':data['email'],
                'phone':data['phone'],
                'address':data['address'],
                'company_name':company.company_name
                
                #yeah man, company.name was the problem
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
        serializer = ManagerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            sendPasswordLink(request, user)
            return Response({"Manager succesfully created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManagerDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, id):
        try:
            return ManagerModel.objects.get(id=id)
        except ManagerModel.DoesNotExist:
            return None

    def get(self, request, id, *args, **kwargs):
        manager = model_to_dict(ManagerModel.objects.get(id=id))
        company = CompanyModel.objects.get(id=manager['company_id'])
        manager['company'] = company.company_name
        # serializer = ManagerSerializer(manager)
        return Response(manager, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        manager = ManagerModel.objects.get(id=id)
        data = {
            'name': request.data.get('name'),
            'surname': request.data.get('surname'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
        }
        serializer = ManagerSerializer(
            instance=manager, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        manager = ManagerModel.objects.get(id=id)
        data = {
            'status': 1
        }
        serializer = ManagerSerializer(
            instance=manager, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # userId = ManagerModel.objects.get(id=id).user_id
            # User.objects.get(id=userId).update(
            #     is_active=0
            # )
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManagerCompany(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, id, *args, **kwargs):
        
        managers = list(ManagerModel.objects.filter(company_id=id).values())
        for manager in managers:
            company = CompanyModel.objects.get(id=manager['company_id'])
            manager['company'] = company.company_name
        return Response(managers, status=status.HTTP_200_OK)
    
class AllManager(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists())):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        managers = list(ManagerModel.objects.filter().values())
        for manager in managers:
            company = CompanyModel.objects.get(id=manager['company_id'])
            manager['company'] = company.company_name
        return Response(managers, status=status.HTTP_200_OK)
