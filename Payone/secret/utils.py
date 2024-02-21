import requests
import hashlib
import hmac
import time
import urllib.parse
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status

class BinanceAPI():
    BASE_URL = "https://api.binance.com"

    def __init__(self):
        # Store your API key and secret as instance attributes
        self.api_key = "hm2y1s1ZpmSmD6zi7nitfQxSIaq5TTkHcj1vfoCqHOBJx4cUHQHIVChQNgqu2lxG"
        self.api_secret = ""

    def apiCallSecret(self, params, endpoint):
        full_endpoint = f"{self.BASE_URL}{endpoint}"

        params["timestamp"] = int(time.time() * 1000)

        # # Create the query string
        query_string = urllib.parse.urlencode(params)

        # # Create the signature
        signature = hmac.new(self.api_secret.encode(
            'utf-8'), query_string.encode('utf-8'), hashlib.sha256).hexdigest()

        # # Add the signature to the params
        params["signature"] = signature

        headers = {
            "X-MBX-APIKEY": self.api_key
        }

        response = requests.get(full_endpoint, params=params, headers=headers)
        return response

    def apiCall(self, params, endpoint):
        full_endpoint = f"{self.BASE_URL}{endpoint}"

        headers = {
            "X-MBX-APIKEY": self.api_key
        }

        response = requests.get(full_endpoint, params=params, headers=headers)
        return response


API_KEY ='WnhKaEpERXdKRVZTYmtjNVF6aEpWa05RTDA0MU0wMVpORUZVZUM1eGRVMHhUVzgzYmt0bE9TOVJTbU5RWkUxYVZVTlZaVEpyVUVwNFQxZDE'

def call_crypto_api(token, endpoint):
    # Construct the full URL with the stored API key, token, and endpoint
    url = f'https://crypto.payone.sbs/api/integration/{endpoint}/{token}?key={API_KEY}'
    print(url)

    try:
        # Send a GET request using the requests library
        response = requests.get(url)
        return response
    except Exception as e:
        # Handle any errors here
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
def call_crypto_apis(endpoint):
    # Construct the full URL with the stored API key, token, and endpoint
    url = f'https://crypto.payone.sbs/api/integration/{endpoint}?key={API_KEY}'
    print(url)

    try:
        # Send a GET request using the requests library
        response = requests.get(url)
        return response

    except Exception as e:
        # Handle any errors here
        return JsonResponse({"error":"Api error"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
