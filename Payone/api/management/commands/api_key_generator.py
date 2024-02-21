# appname/management/commands/generate_api_keys.py
from django.core.management.base import BaseCommand
from api.models import APIKey
from django.contrib.auth.models import User
import secrets
from secret.models import AuthLoginModel

class Command(BaseCommand):
    help = 'Generate and assign API keys to users'

    def handle(self, *args, **kwargs):
        records_to_update = AuthLoginModel.objects.filter(country__isnull=True,region__isnull=True)
        for record in records_to_update:
            record.country = 'TR'
            record.region = 'Adana'
            record.save()