from django.db import models


class CreateUpdateModelMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteModelMixin(models.Model):
    is_active = models.BooleanField(default=True, help_text='This is a soft delete mechanism for the model')

    class Meta:
        abstract = True

    def soft_delete(self):
        self.is_active = False
        self.save()
