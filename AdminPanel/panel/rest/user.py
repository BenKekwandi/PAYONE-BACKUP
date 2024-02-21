from django.contrib.auth.models import User, Group
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from panel.models import *
from panel.helpers import sendPasswordLink


class UserActivation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request,id , *args, **kwargs):
        user = User.objects.get(id=id)
        try:
            SalespersonModel.objects.filter(user_id=id).update(status=0)
        except SalespersonModel.DoesNotExist:
            pass
        try:
            ManagerModel.objects.filter(user_id=id).update(status=0)
        except ManagerModel.DoesNotExist:
            pass
        user.is_active=1
        user.save()
        return Response({f'user activated: {user}'},status=status.HTTP_201_CREATED)
    def delete(self, request,id , *args, **kwargs):
        user = User.objects.get(id=id)
        try:
            SalespersonModel.objects.filter(user_id=id).update(status=1)
        except SalespersonModel.DoesNotExist:
            pass
        try:
            ManagerModel.objects.filter(user_id=id).update(status=1)
        except ManagerModel.DoesNotExist:
            pass
        user.is_active=0
        user.save()
        return Response({f'user deactivated: {user}'},status=status.HTTP_201_CREATED)
      
class UserPasswordLink(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request,id , *args, **kwargs):
        user = User.objects.get(id=id)
        sendPasswordLink(request, user)
        return Response({f'Password Link sent to : {user}'},status=status.HTTP_201_CREATED)


class IpBlock(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request,ip, *args, **kwargs):
        ips=BlockedIpAddressModel.objects.all()
        found=0
        for ip_addr in ips:
            if ip_addr.ip_address == ip:
                found=1
        if found==1:
            return Response({f'IP address:{ip} is already blocked'}, status=status.HTTP_200_OK)
        elif found==0:
            ipObj=BlockedIpAddressModel(ip_address=ip)
            ipObj.save()
            return Response({f'IP address:{ip} has been succesfully blocked'}, status=status.HTTP_200_OK)
    def delete(self, request,ip, *args, **kwargs):
        ips=BlockedIpAddressModel.objects.all()
        found=0
        for ip_addr in ips:
            if ip_addr.ip_address == ip:
                found=1
        if found==1:
            ipObj=BlockedIpAddressModel.objects.get(ip_address=ip)
            ipObj.delete()
            return Response({f'IP address:{ip} has been succesfully unblocked'}, status=status.HTTP_200_OK)
        elif found==0:
            return Response({f'IP address:{ip} is not in the blocked ip addresses list'}, status=status.HTTP_200_OK)
        
