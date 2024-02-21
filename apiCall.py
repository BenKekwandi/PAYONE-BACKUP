from django.http import JsonResponse
import requests

def api_request_view(request):
    api_url = "https://payone.com.tr/deposit-history"

    try:
        response = requests.get(api_url)

        if response.status_code == 200:
    
            return 0
        else:
            return JsonResponse({'error': 'API request failed'}, status=500)
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)
    