from django.urls import re_path
from secret.consumers import exchangeRatesConsumer

websocket_urlpatterns = [
    re_path(r'ws/exchange-rates/$', exchangeRatesConsumer.as_asgi()),
]