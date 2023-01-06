# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import uuid
import requests
from datetime import datetime


def populate_slug_for_multiple_locations(locations):
    slug = str(uuid.uuid4())[:6]
    for location in locations:
        if not location.get('slug'):
            location['slug'] = slug
    return locations

def fetchPlacesDetail(request):
    url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJidSn58x-44kRljrzwE_Oics&key=AIzaSyDDGxxizNQlXmcZCSP09JvDW8BS6mTeaik"
    payload={}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    return response