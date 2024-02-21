from django.db import models
from django.contrib.auth.models import User

class APIKey(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    key = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.key
