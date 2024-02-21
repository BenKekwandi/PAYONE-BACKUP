from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import SalespersonModel
from ..serializers import SalespersonSerializer
from .log_histroy import Users


class Salesperson(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        salespersons = SalespersonModel.objects.filter()
        serializer = SalespersonSerializer(salespersons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        userId = Users.create_user(request, 'Operator')
        data = {
            'name': request.data.get('name'),
            'surname': request.data.get('surname'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'virtual_email': request.data.get('virtual_email'),
            'company_id': request.data.get('company_id'),
            'user_id': userId,
            'status': request.data.get('status')
        }
        serializer = SalespersonSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SalespersonDetail(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get_object(self, id):
        try:
            return SalespersonModel.objects.get(id=id)
        except SalespersonModel.DoesNotExist:
            return None

    def get(self, request, id, *args, **kwargs):
        salesperson = SalespersonModel.objects.get(id=id)
        if not salesperson:
            return Response(
                {"res": "Object with Salesperson id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = SalespersonSerializer(salesperson)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
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
            'virtual_email': request.data.get('virtual_email'),
            'company_id': request.data.get('company_id'),
            'user_id': request.data.get('user_id'),
            'status': request.data.get('status')
        }
        serializer = SalespersonSerializer(
            instance=salesperson, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):
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
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
