# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

from django.urls import path, re_path

from apps.core.views import LocationView

urlpatterns = [
    path('location/', LocationView.as_view()),
    re_path('location/(.*)', LocationView.as_view(), name='get-locations'),
]
