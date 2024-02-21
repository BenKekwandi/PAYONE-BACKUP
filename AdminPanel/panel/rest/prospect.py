from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..models import ProspectModel
from ..serializers import ProspectSerializer


class Prospect(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        prospects = ProspectModel.objects.filter(status=0)
        serializer = ProspectSerializer(prospects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = {
            'company_name': request.data.get('company_name'),
            'address': request.data.get('company_address'),
            'contact_person': request.data.get('contact_person'),
            'business_registration_number': request.data.get('business_registration_number'),
            'country': request.data.get('country'),
            'city': request.data.get('city'),
            'post_code': request.data.get('postal_code'),
            'website': request.data.get('website'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'status':request.data.get('status')
        }
        serializer = ProspectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'Prospect succesfully registered in the system'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProspectDetail(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def get_object(self, id):
        try:
            return ProspectModel.objects.get(id=id)
        except ProspectModel.DoesNotExist:
            return None

    def get(self, request, id, *args, **kwargs):
        prospect = ProspectModel.objects.get(id=id)
        if not prospect:
            return Response(
                {"res": "Object with Company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ProspectSerializer(prospect)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        prospect= ProspectModel.objects.get(id=id)
        if not prospect:
            return Response(
                {"res": "Object with company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'company_name': request.data.get('company_name'),
            'company_address': request.data.get('company_address'),
            'contact_person': request.data.get('contact_person'),
            'business_registration_number': request.data.get('business_registration_number'),
            'country': request.data.get('country'),
            'city': request.data.get('city'),
            'postal_code': request.data.get('postal_code'),
            'website': request.data.get('website'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
        }
        serializer = ProspectSerializer(
            instance=prospect, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):
        prospect = ProspectModel.objects.get(id=id)
        if not prospect:
            return Response(
                {"res": "Object with company id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        prospect.delete()
        return Response({}, status=status.HTTP_200_OK)
