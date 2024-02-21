from pathlib import Path
import os
import configparser



PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(PROJECT_DIR)

config = configparser.ConfigParser()
config.read('/var/www/AdminPanel/AdminPanel/config.ini')

DEFAULT_CHARSET = 'utf-8'


SECRET_KEY = 'django-insecure-50s+o4y*9$sf1yd60&s__5s=n9&$vdo0mq91e^be*dh3kmn0ra'

BASE_URL = 'https://payone.site'


LOGIN_URL = '/account/login/'

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/auth/login'

DEBUG = False

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST=config.get('SMTP', 'host')
EMAIL_HOST_PASSWORD = config.get('SMTP', 'password')
EMAIL_HOST_USER = config.get('SMTP', 'user')
EMAIL_PORT = 587
EMAIL_USE_TLS = False



ALLOWED_HOSTS = [
"www.payone.site",
"payone.site",
"172.18.0.2"
"127.0.0.1",
"localhost"
]


LOCALE_PATHS = [
    os.path.join(BASE_DIR,'locale')
]



INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.utils',
    'panel',
    'rest_framework',
    'django_otp',
    'django_otp.plugins.otp_static',
    'django_otp.plugins.otp_totp',
    'two_factor',
    'rosetta',
   # 'ipware',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django_otp.middleware.OTPMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware'

]

ROOT_URLCONF = 'AdminPanel.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

INTERNAL_IPS = [
    # ...
    "192.168.5.5",
    "127.0.0.1"
    # ...
]

WSGI_APPLICATION = 'AdminPanel.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config.get('MySQL', 'database'),
        'USER': config.get('MySQL', 'user'),
        'PASSWORD': config.get('MySQL', 'password'),
        'HOST': config.get('MySQL', 'host'),
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



LANGUAGE_CODE = 'en'

LANGUAGES = (
    ('en', 'English'),
    ('tr', 'Turkish'),
    #('fr', 'French'),
    #('ru', 'Russian'),
)

LANGUAGE_COOKIE_NAME='AdminPanel'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = False

STATIC_ROOT = os.path.join(BASE_DIR, "public/static/")

STATIC_URL = '/static/'


MEDIA_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/'


STATICFILES_DIRS = [
    
    BASE_DIR+"/static",

]

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_SECURE=True

SESSION_COOKIE_AGE = 7200

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

BANK_SFTP_HOST = config.get('SFTP', 'host'),
BANK_SFTP_USERNAME = config.get('SFTP', 'user'),
BANK_SFTP_PASSWORD = config.get('SFTP', 'password'),
BANK_SFTP_PORT = config.get('SFTP', 'port'),

CSRF_TRUSTED_ORIGINS = ["127.0.0.1","localhost","https://www.payone.site","https://payone.site","http://172.18.0.2", "http://185.198.197.35"]
CSRF_COOKIE_SECURE = True
