from django.db.models.signals import post_save
from django.contrib.auth.models import Group
from django.dispatch import receiver
from django.contrib.auth.models import User


@receiver(post_save, sender=User)
def assign_superuser_to_admin_group(sender, instance, created, **kwargs):
    if created and instance.is_superuser:
        admin_group = Group.objects.get(name='Admin')
        instance.groups.add(admin_group)
