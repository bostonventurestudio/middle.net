# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

from apps.core.constants import LOCATION, CENTER
from apps.core.models import Location
from apps.core.serializers import LocationModelSerializer, LocationSerializer
from apps.core.utils import populate_slug_for_multiple_locations
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView


class LocationView(APIView):
    def get(self, request, slug):
        center = Location.objects.filter(slug=slug, type=CENTER).first()
        data = {
            'locations': LocationModelSerializer(Location.objects.filter(slug=slug, type=LOCATION), many=True).data,
            'center': {'lat': center.latitude, 'lng': center.longitude} if center else None
        }
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = LocationSerializer(data=populate_slug_for_multiple_locations(request.data), many=True)
        serializer.is_valid(raise_exception=True)
        if len(serializer.validated_data) > 0:
            Location.objects.filter(slug=serializer.validated_data[0]['slug']).delete()
        locations = serializer.save()
        data = {}
        if len(locations) > 0:
            center = Location.objects.filter(slug=locations[0].slug, type=CENTER).first()
            data = {
                'locations': LocationModelSerializer(Location.objects.filter(slug=locations[0].slug, type=LOCATION), many=True).data,
                'center': {'lat': center.latitude, 'lng': center.longitude} if center else None
            }
        return Response(data, status=status.HTTP_201_CREATED)

    def delete(self, request, slug):
        if 'id' in request.query_params:
            get_object_or_404(Location, slug=slug, id=request.query_params.get('id')).delete()
            return Response('Location deleted successfully', status=status.HTTP_204_NO_CONTENT)
        return Response('id is required', status=status.HTTP_400_BAD_REQUEST)
