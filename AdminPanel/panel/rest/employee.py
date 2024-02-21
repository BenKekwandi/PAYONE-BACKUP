from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User, Group
from ..models import EmployeeModel
from ..serializers import EmployeeSerializer
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from ..helpers import sendPasswordLink


class Employee(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        employees = EmployeeModel.objects.filter(status=0)
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
        group_name = 'Operator'
        group = Group.objects.get(name=group_name)
        user = User.objects.create(**userData)
        user.groups.add(group)
        if not user:
            return Response(
                {"res": "Failed to set the employee as a system User"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.groups.add(group)
        data = {
            'name': request.data.get('name'),
            'surname': request.data.get('surname'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'position': request.data.get('position'),
            'user_id': user.id
        }
        serializer = EmployeeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            sendPasswordLink(request, user)
            return Response({"Employee succesfully created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, id):
        try:
            return EmployeeModel.objects.get(id=id)
        except EmployeeModel.DoesNotExist:
            return None

    def get(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        employee = EmployeeModel.objects.get(id=id)
        if not employee:
            return Response(
                {"res": "Object with Employee id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        employee = EmployeeModel.objects.get(id=id)
        if not employee:
            return Response(
                {"res": "Object with Employee id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'name': request.data.get('name'),
            'surname': request.data.get('surname'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'position': request.data.get('position'),
        }
        serializer = EmployeeSerializer(
            instance=employee, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        employee = EmployeeModel.objects.get(id=id)
        if not employee:
            return Response(
                {"res": "Object with Employee id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'status': 1
        }
        serializer = EmployeeSerializer(
            instance=employee, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllEmployee(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if(not request.user.groups.filter(name='Admin').exists()):
            return Response({"error: Admin privileges required"}, status=status.HTTP_400_BAD_REQUEST)
        employees = EmployeeModel.objects.filter()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)