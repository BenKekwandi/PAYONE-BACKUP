from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AdminPanel.settings')

app = Celery('panel')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.update(
    worker_pool_restarts=True,
    worker_hostname="localhost"
)

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'sendBankReport-every-minute': {
        'task': 'panel.task.sendBankReport',
        'schedule': crontab(),
    },
}
