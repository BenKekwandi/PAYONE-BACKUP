from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import CommissionTypeModel
from ..serializers import CommissionTypeSerializer

class CommissionType(APIView):
    def get(self, request, *args, **kwargs):
        commissionTypes = CommissionTypeModel.objects.all()
        serializer = CommissionTypeSerializer(commissionTypes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)