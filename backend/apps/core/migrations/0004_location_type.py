# Generated by Django 3.2 on 2022-07-15 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_location_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='type',
            field=models.CharField(choices=[('location', 'Location'), ('center', 'Center')], default='location', max_length=20),
        ),
    ]
