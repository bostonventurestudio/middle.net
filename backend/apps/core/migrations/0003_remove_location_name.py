# Generated by Django 3.2 on 2022-05-23 06:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_location_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='location',
            name='name',
        ),
    ]