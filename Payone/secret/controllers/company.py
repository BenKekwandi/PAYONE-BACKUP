from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import CompanyModel
from ..serializers import CompanySerializer
from django.http import JsonResponse


class Company(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        companies = CompanyModel.objects.filter()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = {
            'company_name': request.data.get('company_name'),
            'owner_name': request.data.get('owner_name'),
            'email': request.data.get('email'),
            'commission_rate': request.data.get('commission_rate'),
            'phone': request.data.get('phone'),
            'status': request.data.get('status')
        }
        serializer = CompanySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyDetail(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get_object(self, id):
        try:
            return CompanyModel.objects.get(id=id)
        except CompanyModel.DoesNotExist:
            return None

    def get(self, request, id, *args, **kwargs):
        company = CompanyModel.objects.get(id=id)
        if not company:
            return Response(
                {"res": "Object with Company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        company = CompanyModel.objects.get(id=id)
        if not company:
            return Response(
                {"res": "Object with company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'company_name': request.data.get('company_name'),
            'owner_name': request.data.get('owner_name'),
            'email': request.data.get('email'),
            'commission_rate': request.data.get('commission_rate'),
            'phone': request.data.get('phone'),
            'status': request.data.get('status')
        }
        serializer = CompanySerializer(
            instance=company, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):
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
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
