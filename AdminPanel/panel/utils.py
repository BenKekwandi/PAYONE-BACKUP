import requests
import hashlib
import hmac
import time
import urllib.parse
import requests


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



def get_geo_location(ip_address):
    try:
        # Make a GET request to the ipinfo.io API
        response = requests.get(f'https://ipinfo.io/{ip_address}/json')

        # Check for a successful response
        if response.status_code == 200:
            data = response.json()
            location_info = {
                "ip": data.get("ip"),
                "city": data.get("city"),
                "region": data.get("region"),
                "country": data.get("country"),
                "latitude": data.get("loc").split(',')[0],
                "longitude": data.get("loc").split(',')[1],
            }
            return location_info
        else:
            return {"error": "Unable to fetch geolocation data"}
    except requests.exceptions.RequestException:
        return {"error": "Failed to connect to the geolocation API"}