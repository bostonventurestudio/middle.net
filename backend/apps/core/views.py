import json

from rest_framework.response import Response
from rest_framework.views import APIView

from backend.apps.core.models import Location
from backend.apps.core.serializers import LocationModelSerializer, LocationSerializer


class LocationView(APIView):
    def get(self, request, slug):
        return Response(LocationModelSerializer(Location.objects.filter(slug=slug), many=True).data)

    def post(self, request):
        serializer = LocationSerializer(data=json.loads(request.data.get('data')))
        serializer.is_valid(raise_exception=True)
        location = serializer.save()
        return Response(LocationModelSerializer(Location.objects.filter(slug=location.slug), many=True).data)
