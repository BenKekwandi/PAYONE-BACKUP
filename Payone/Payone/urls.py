from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns 
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    #path("captcha/",include("captcha.urls")),
    path('admin/', admin.site.urls),
    path('', include('secret.urls')),
    path('auth/', include('auth.urls')),
    path("chat/", include("chat.urls")),
    path("api/v1/", include("api.urls")),
    path(r'^i18n/',include('django.conf.urls.i18n')),


]
urlpatterns += i18n_patterns( 
    path('', include('secret.urls')),
    prefix_default_language=True
)

if 'rosetta' in settings.INSTALLED_APPS:
    urlpatterns += [
        re_path(r'^rosetta/', include('rosetta.urls'))
    ]
urlpatterns += staticfiles_urlpatterns()

# if settings.DEBUG:
#     import debug_toolbar
#     urlpatterns = [
#     path("__debug__/", include("debug_toolbar.urls")),

#     ]+urlpatterns
