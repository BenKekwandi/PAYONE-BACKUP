from django.contrib import admin
from django.urls import path, include, re_path
from two_factor.urls import urlpatterns as tf_urls
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.i18n import i18n_patterns 
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path(r'^i18n/',include('django.conf.urls.i18n')),
    path('auth/', include('auth.urls')),
    path('', include('panel.urls')),
]

urlpatterns += i18n_patterns( 
    #path('admin/', admin.site.urls),
    path('', include('panel.urls')),
    #path('auth/', include('auth.urls')),
    #path('api/', include('rest_framework.urls')),
    #path('', include(tf_urls)),
    prefix_default_language=True
)

if 'rosetta' in settings.INSTALLED_APPS:
    urlpatterns += [
        re_path(r'^rosetta/', include('rosetta.urls'))
    ]

#urlpatterns += staticfiles_urlpatterns()

handler404 = 'panel.views.handler404'
#handler500 = 'panel.views.handler500'
handler403 = 'panel.views.handler403'
