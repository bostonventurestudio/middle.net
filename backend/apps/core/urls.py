from django.urls import path, re_path

from backend.apps.core.views import LocationView, NearbyPlacesView

urlpatterns = [
    path('location/', LocationView.as_view()),
    re_path('location/(.*)', LocationView.as_view(), name='get-locations'),
    re_path('nearby-places/', NearbyPlacesView.as_view(), name='get-locations'),

]
