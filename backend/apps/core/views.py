from django.conf import settings
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import Location
from apps.core.serializers import LocationModelSerializer, LocationSerializer


class LocationView(APIView):
    def get(self, request, slug):
        locations = Location.objects.filter(slug=slug)
        page = request.GET.get('page', 1)
        paginator = Paginator(locations, settings.PAGE_SIZE)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = []
        return Response(
            {"total": paginator.count, "per_page": settings.PAGE_SIZE, "current_page": page,
             "locations": LocationModelSerializer(data, many=True).data,
             })

    def post(self, request):
        serializer = LocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        location = serializer.save()
        locations = Location.objects.filter(slug=location.slug)
        return Response(
            {"success": True, "message": "Location Added ", "locations": LocationModelSerializer(locations,many=True).data})
