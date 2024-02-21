from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import SalespersonModel, CompanyModel,ManagerModel
from django.contrib.auth.models import User, Group
from ..serializers import SalespersonSerializer
from ..helpers import sendPasswordLink
from django.forms.models import model_to_dict
from django.contrib.auth.hashers import make_password
from django.template.loader import get_template
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.conf import settings

class Salesperson(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        salespersons=[]
        if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists() or request.user.groups.filter(name='Manager').exists())):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        salespersons = list(SalespersonModel.objects.filter(status=0).values())
        if(request.user.groups.filter(name='Manager').exists()):
            managerCompanyId = ManagerModel.objects.get(user_id=request.user.id).company_id
            salespersons = list(SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).values())
        for salesperson in salespersons:
            company = CompanyModel.objects.get(id=salesperson['company_id'])
            salesperson['company'] = company.company_name
        return Response(salespersons, status=status.HTTP_200_OK)
    
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
        print(f"Here is check value:{check}")
        if check > 0:
            return Response({f"This email already exists in the system"}, status=status.HTTP_200_OK )
        userData['password'] = make_password('admin@1234')
        group_name = 'Salesperson'
        group = Group.objects.get(name=group_name)
        user = User.objects.create(**userData)
        print(f"\nHere is the salesperson user object: {user}\n")

        print(f"\nHere is the salesperson user object id: {user.id}\n")
        user.groups.add(group)
        if not user:
            return Response(
                {"res": "Failed to set the salesperson as a system User"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'name': request.data.get('name'),
            'surname': request.data.get('surname'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'company_id': request.data.get('company_id'),
            'user_id': user.id
        }
        company=CompanyModel.objects.get(id=request.data.get('company_id'))
        html_template= get_template('emails/new_salesperson.html')
        context = {
            'subject':'New Salesperson has been created',
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
        recipient_list = ['arekanteknoloji@gmail.com']
        plain_message = strip_tags(html_content)
        send_mail(
            context['subject'],
            plain_message,
            from_email,
            recipient_list,
            html_message=html_content,
            fail_silently=False,
        )
        serializer = SalespersonSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            sendPasswordLink(request, user)
            return Response({"Salesperson succesfully created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SalespersonDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, id):
        try:
            return SalespersonModel.objects.get(id=id)
        except SalespersonModel.DoesNotExist:
            return None
    def get(self, request, id, *args, **kwargs):
        if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists() or request.user.groups.filter(name='Manager').exists())):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        salesperson = model_to_dict(SalespersonModel.objects.get(id=id))
        if not salesperson:
            return Response(
                {"res": "Object with Salesperson id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        company = CompanyModel.objects.get(id=salesperson['company_id'])
        salesperson['company'] = company.company_name
        # serializer = SalespersonSerializer(salesperson)
        return Response(salesperson, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        salesperson = SalespersonModel.objects.get(id=id)
        if not salesperson:
            return Response(
                {"res": "Object with Salesperson id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'name': request.data.get('name'),
            'surname': request.data.get('surname'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
        }
        serializer = SalespersonSerializer(
            instance=salesperson, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        salesperson = SalespersonModel.objects.get(id=id)
        if not salesperson:
            return Response(
                {"res": "Object with Salesperson id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'status': 1
        }
        serializer = SalespersonSerializer(
            instance=salesperson, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # userId = SalespersonModel.objects.get(id=id).user_id
            # User.objects.get(id=userId).update(
            #     is_active=0
            # )
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SalespersonCompany(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        salespersons = list(
            SalespersonModel.objects.filter(company_id=id).values())
        for salesperson in salespersons:
            company = CompanyModel.objects.get(id=salesperson['company_id'])
            salesperson['company'] = company.company_name
        return Response(salespersons, status=status.HTTP_200_OK)


class AllSalesperson(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        salespersons=[]
        if(not (request.user.groups.filter(name='Admin').exists() or request.user.groups.filter(name='BankOperator').exists() or request.user.groups.filter(name='Manager').exists())):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        salespersons = list(SalespersonModel.objects.filter().values())
        if(request.user.groups.filter(name='Manager').exists()):
            managerCompanyId = ManagerModel.objects.get(user_id=request.user.id).company_id
            salespersons = list(SalespersonModel.objects.filter(company_id=managerCompanyId,status=0).values())
        for salesperson in salespersons:
            company = CompanyModel.objects.get(id=salesperson['company_id'])
            salesperson['company'] = company.company_name
        return Response(salespersons, status=status.HTTP_200_OK)