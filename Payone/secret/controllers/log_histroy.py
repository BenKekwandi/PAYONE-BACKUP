from ..models import AuthLoginModel
from rest_framework.views import APIView
from ..serializers import AuthLoginModelSerializer
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail


class LogHistory(APIView):
    def get(self, request, *args, **kwargs):
        logs = AuthLoginModel.objects.filter(user_id=request.user.id)
        serializer = AuthLoginModelSerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)