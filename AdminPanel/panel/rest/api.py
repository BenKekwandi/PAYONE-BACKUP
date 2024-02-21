from django.http import JsonResponse
from rest_framework.views import APIView
from ..utils import BinanceAPI
from ..models import SalespersonModel


class exchangeRates(APIView):
    def get(self, request):
        binance_api = BinanceAPI()

        symbols = ["BTCUSDT", "ETHUSDT", "LTCUSDT", "BTCTRY",
                   "ETHTRY", "LTCTRY", "USDCUSDT", "USDTTRY"]
        endpoint = "/api/v3/ticker/24hr"

        responses = []
        for symbol in symbols:
            params = {"symbol": symbol}
            response = binance_api.apiCall(params, endpoint)
            responses.append(response.json())

        return JsonResponse(responses, safe=False)


class depositHistory(APIView):

    def get(self, request):
        binance_api = BinanceAPI()
        endpoint = "/sapi/v1/capital/deposit/hisrec"

        params = {
            "coin": '',
            "status": ''
        }
        response = binance_api.apiCallSecret(params, endpoint)

        return JsonResponse(response.json(), safe=False)

    def post(self, request):
        if request.method == 'POST':
            binance_api = BinanceAPI()
            endpoint = "/sapi/v1/capital/deposit/hisrec"

            coin = request.data.get('coin')
            status = request.data.get('status')

            params = {
                "coin": coin,
                "status": status
            }
            response = binance_api.apiCallSecret(params, endpoint)

            return JsonResponse(response.json(), safe=False)
        else:
            return {'<script>alert("just dont")</script>'}
