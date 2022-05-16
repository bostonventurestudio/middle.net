from logging import getLogger

from rest_framework import serializers

from apps.core.models import Location

logger = getLogger(__name__)


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'
    # name = serializers.CharField(required=True, max_length=200)
    # address = serializers.CharField(required=False)
    # google_place_id = serializers.CharField(required=False)
    # latitude = serializers.DecimalField(required=False, decimal_places=5, max_digits=8)
    # longitude = serializers.DecimalField(required=False, decimal_places=5, max_digits=8)
    # slug = serializers.SlugField(required=False)


#
# class KeyWordIdsSerializer(serializers.Serializer):
#     ids = serializers.ListField(child=serializers.IntegerField())
#
#
# class KeyWordModelSerializer(serializers.ModelSerializer):
#     options = serializers.SerializerMethodField()
#
#     def get_options(self, instance):
#         if instance.options and type(instance.options) == str:
#             options = instance.options
#             if "'" in options:
#                 options = instance.options.replace("'", '"')
#             return json.loads(options)
#         return instance.options
#
#     class Meta:
#         model = KeyWord
#         fields = ["id", "user_id", "value", "type", "options", "created_at", "public", "visible"]
#
#
# class ItemModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ItemName
#         fields = ["id", "name"]


class LocationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'
