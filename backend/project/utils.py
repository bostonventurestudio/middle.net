import requests
from django.http import HttpResponse
from rest_framework.response import Response

def fetchPlacesDetail(request,placeid):
    response = requests.get(
  'https://maps.googleapis.com/maps/api/place/details/json?place_id='+placeid+'&key=AIzaSyDDGxxizNQlXmcZCSP09JvDW8BS6mTeaik'
    )
    return HttpResponse(response)

  # 'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJidSn58x-44kRljrzwE_Oics&key=AIzaSyDDGxxizNQlXmcZCSP09JvDW8BS6mTeaik'

def fetchImg(request, endUrl):
  response = requests.get(endUrl)
  return HttpResponse(response,content_type="image/png")

  # 'https://lh3.googleusercontent.com/a/AEdFTp6NvUZqMqxpPiUZLb3rHbiwtxQOqm70cw0ITyBk=s128-c0x00000000-cc-rp-mo'

