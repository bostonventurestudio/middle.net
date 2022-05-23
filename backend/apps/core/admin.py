from django.contrib import admin

from apps.core.models import Location


# Register your models here.


class LocationAdmin(admin.ModelAdmin):
    list_display = ['slug', 'address']

    class Meta:
        model = Location


admin.site.register(Location, LocationAdmin)
