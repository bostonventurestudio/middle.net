import json
from datetime import datetime

import requests
from apps.core.models import Location
from apps.core.serializers import LocationModelSerializer, LocationSerializer
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.utils import populate_slug_for_multiple_locations, get_open_close_time


class LocationView(APIView):
    def get(self, request, slug):
        return Response(LocationModelSerializer(Location.objects.filter(slug=slug), many=True).data)

    def post(self, request):
        serializer = LocationSerializer(data=populate_slug_for_multiple_locations(request.data), many=True)
        serializer.is_valid(raise_exception=True)
        locations = serializer.save()
        return Response(LocationModelSerializer(Location.objects.filter(slug=locations[0].slug) if len(locations) > 0 else [], many=True).data, status=status.HTTP_201_CREATED)

    def delete(self, request, slug):
        if 'id' in request.query_params:
            get_object_or_404(Location, slug=slug, id=request.query_params.get('id')).delete()
            return Response('Location deleted successfully', status=status.HTTP_204_NO_CONTENT)
        return Response('id is required', status=status.HTTP_400_BAD_REQUEST)


class NearbyPlacesView(APIView):
    def post(self, request):
        try:
            response = requests.request("GET", request.data.get('places_url'))
            if response.status_code != status.HTTP_200_OK:
                return Response(response.text, status=response.status_code)
            places = json.loads(response.text)['results'][:5]
            for place in places:
                place['abc'] = json.loads(response.text).get('result')
                response = requests.request("GET", f'{request.data.get("opening_hours_url")}&place_id={place["place_id"]}')
                if response.status_code == status.HTTP_200_OK:
                    place['open_at'], place['close_at'] = get_open_close_time(json.loads(response.text).get('result'))
            return Response(places)
        except Exception as e:
            print(e)
            return Response(e.args, status=status.HTTP_400_BAD_REQUEST)
