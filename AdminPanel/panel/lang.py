from django.conf import settings
from django.http import HttpResponse
from django.utils import translation
from django.utils.translation import activate,check_for_language
from django.http import HttpResponse,Http404,HttpResponseRedirect,HttpResponseBadRequest
from django.http import request
from django.shortcuts import redirect
from django.views.i18n import set_language
from django.urls import reverse
from . import views


def language_switch(request):
    lang=request.POST.get('language')
    if lang and check_for_language(lang):
        activate(lang)
        response = redirect(request.META.get('HTTP_REFERER'))
        request.session['current_language']=lang
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang)
        return response
    return HttpResponseBadRequest()