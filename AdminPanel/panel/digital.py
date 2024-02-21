from django.shortcuts import render, redirect
from .models import (
    ProspectModel,
    SalespersonModel,
    CompanyModel,
)
from .serializers import (
    CompanySerializer,
    SalespersonSerializer,
    ManagerSerializer,
    ProspectSerializer
)
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from .helpers import sendPasswordLink
import os
from django.conf import settings
from django_weasyprint.views import WeasyTemplateView

    
def createUser(request, data, role):
    userData = {
        'username': data['email'],
        'first_name': data['name'],
        'last_name': data['surname'],
        'email': data['email']
    }
    check = User.objects.filter(email=userData['email']).count()
    if check > 0:
        print('This email already exists in the system')
        return
    userData['password'] = make_password('admin@1234')
    group_name = role
    group = Group.objects.get(name=group_name)
    user = User.objects.create(**userData)
    print(f"\nHere is the user object: {user}\n")
    print(f"\nHere is the user object id: {user.id}\n")
    user.groups.add(group)
    return user.id

def createSalesperson(request, data):
    # Check if all values in data are empty
    if all(value == '' for value in data.values()):
        print('Form submitted with empty data')
        # You can handle it according to your requirements
        return
    try:
        
        data['user_id'] = createUser(request, data, 'Salesperson')
        user = User.objects.get(id=data['user_id'])
        # Use the partial argument to allow partial updates
        serializer = SalespersonSerializer(data=data, partial=True)

        if not serializer.is_valid():
            errors = serializer.errors
            print(errors)
        else:
            serializer.save()
            sendPasswordLink(request, user)
    except:
        pass


def createManager(request, data):
    if all(value == '' for value in data.values()):
        print('Form submitted with empty data')
        return
    try:
        data['user_id'] = createUser(request, data, 'Manager')
        user = User.objects.get(id=data['user_id'])
        serializer = ManagerSerializer(data=data, partial=True)
        if not serializer.is_valid():
            errors = serializer.errors
            print(errors)
        else:
            serializer.save()
            sendPasswordLink(request, user)
    except:
        pass


def createCompany(data):
    company = CompanyModel.objects.create(
        company_name=data['company_name'],
        owner_name=data['owner_name'],
        email=data['email'],
        phone=data['phone'],
        address=data['address'],
        commission_rate=data['commission_rate'],
        commission_type_id=data['commission_type_id'],
        bank_account_no=data['bank_account_no']
    )
    company_folder = os.path.join(
        settings.BASE_DIR, 'uploads/companies/company-'+str(company.id))
    os.makedirs(company_folder)
    return company.id

@login_required(login_url='/./auth/login')
def prospect_application(request,id):
    try:
        prospect = ProspectModel.objects.get(id=id)
    except ObjectDoesNotExist:
        return redirect('/404')
    prospect = ProspectModel.objects.get(id=id)
    context = model_to_dict(prospect)
    if request.method=='POST':
        company_data = {
            'company_name': request.POST.get('company_name'),
            'owner_name': request.POST.get('contact_person'),
            'email': request.POST.get('email'),
            'phone': request.POST.get('phone'),
            'address': request.POST.get('company_address'),
            'commission_rate': request.POST.get('commission_rate'),
            'commission_type_id':request.POST.get('commission_type'),
            'bank_account_no':request.POST.get('account_no')
        }
        companyId = createCompany(company_data)
        salesperson_data = {
            'name': request.POST.get('salesperson1_name'),
            'surname': request.POST.get('salesperson1_surname'),
            'email': request.POST.get('salesperson1_email'),
            'phone': request.POST.get('salesperson1_phone'),
            'address': request.POST.get('salesperson1_address'),
            'company_id': companyId,
        }
        if all(salesperson_data[key].strip() and isinstance(salesperson_data[key], str) for key in ['name', 'surname', 'email']):
            createSalesperson(request, salesperson_data)
        manager_data = {
            'name': request.POST.get('manager_name'),
            'surname': request.POST.get('manager_surname'),
            'email': request.POST.get('manager_email'),
            'phone': request.POST.get('manager_phone'),
            'address': request.POST.get('manager_address'),
            'company_id': companyId
        }
        if all(manager_data[key].strip() and isinstance(manager_data[key], str) for key in ['name', 'surname', 'email']):
            createManager(request, manager_data)
        prospect.status = 1 
        prospect.save()
        return redirect('/companies/')
    return render(request, 'application.html',context)

class prospect_document(WeasyTemplateView):
    template_name='pdf/prospect.html'
    pdf_filename='agreement.pdf'
    pk_url_kwarg = 'id'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context = model_to_dict(ProspectModel.objects.get(id=int(self.kwargs['id'])))
        return context
