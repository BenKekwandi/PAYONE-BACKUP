from django.apps import AppConfig
from django.db.models.signals import post_save


class PanelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'panel'

    def ready(self):
        from panel.signals import assign_superuser_to_admin_group
        from django.contrib.auth.models import User, Group

        Group.objects.get_or_create(name='Admin')
        Group.objects.get_or_create(name='BankOperator')
        Group.objects.get_or_create(name='Operator')
        Group.objects.get_or_create(name='Manager')
        Group.objects.get_or_create(name='Salesperson')

        post_save.connect(assign_superuser_to_admin_group, sender=User)
