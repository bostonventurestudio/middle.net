# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

import uuid

from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver

from apps.core.constants import LOCATION, LOCATION_TYPES


class Location(models.Model):
    latitude = models.DecimalField(max_digits=8, decimal_places=5, db_index=True)
    longitude = models.DecimalField(max_digits=8, decimal_places=5, db_index=True)
    google_place_id = models.CharField(max_length=200, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    type = models.CharField(choices=LOCATION_TYPES, max_length=20, default=LOCATION)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(max_length=8, blank=True, null=True)

    def __str__(self):
        return self.slug

    class Meta:
        db_table = "location"


@receiver(pre_save, sender=Location)
def build_slug(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = str(uuid.uuid4())[:6]
