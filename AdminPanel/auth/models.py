from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class AuthPasswordTokenModel(models.Model):
    token_string = models.CharField(max_length=60)
    user_id = models.IntegerField()
    expiration_date = models.DateTimeField()
    generation_date = models.DateTimeField()

    class Meta:
        app_label = 'auth'
        db_table = "auth_password_token"
