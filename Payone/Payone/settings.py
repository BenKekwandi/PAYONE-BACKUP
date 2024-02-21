import os

from pathlib import Path
import configparser
from datetime import timedelta
# from rest_framework_simplejwt.authentication import JWTAuthentication


PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(PROJECT_DIR)



config = configparser.ConfigParser()
config.read('/var/www/Payone/Payone/config.ini')


DEFAULT_CHARSET = 'utf-8'

BASE_URL = 'https://payone.com.tr'

SECRET_KEY = 'django-insecure-ptyo64+agqk3f4qevgn^dzocm5f_1r&)(u(rk#%yhiol)4!!05'

LOGIN_REDIRECT_URL = '/secret'
LOGOUT_REDIRECT_URL = '/auth/2fa-login/'

DEBUG = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


RECAPTCHA_PUBLIC_KEY='6LeOOcwoAAAAAFUd2HzU4yBThLSDlu-GZ48g3OCp'
RECAPTCHA_PRIVATE_KEY='6LeOOcwoAAAAAKc8TEtsoBgj3t8mkNfhXbB0WPb8'
RECAPTCHA_REQUIRED_SCORE = 0.85


EMAIL_HOST=config.get('SMTP', 'host')
EMAIL_HOST_PASSWORD = config.get('SMTP', 'password')
EMAIL_HOST_USER = config.get('SMTP', 'user')
EMAIL_PORT = 587
EMAIL_USE_TLS = False


ALLOWED_HOSTS = [
    '172.18.0.2',
    "www.payone.site",
    "payone.site"
]


INSTALLED_APPS = [
    "daphne",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.utils',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_otp.plugins.otp_totp',
    'rest_framework',
    'corsheaders',
    'crispy_forms',
    'chat',
    'api',
    'secret',
    'rosetta',
    'captcha',
]

CRISPY_TEMPLATE_PACK = 'bootstrap4'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware'
]

ROOT_URLCONF = 'Payone.urls'

TEMPLATES = [
    {
        "BACKEND": 'django.template.backends.django.DjangoTemplates',
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

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
         'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=7),
    'SLIDING_TOKEN_REFRESH_LIFETIME_ALGORITHM': 'HS256',
    'SLIDING_TOKEN_LIFETIME_ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'console': {
#             'class': 'logging.StreamHandler',
#         },
#     },
#     'root': {
#         'handlers': ['console'],
#         'level': 'DEBUG',
#     },
# }

INTERNAL_IPS = [
    # ...
    "127.0.0.1"
    "172.18.0.2",
    # ...
]

ASGI_APPLICATION = "Payone.asgi.application"
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        #  "BACKEND": "channels.layer.InMemoryChannelLayer",
        "CONFIG": {
            "hosts": [("192.168.5.5", 6379)],
        },
    },
}

WSGI_APPLICATION = 'Payone.wsgi.application'


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

LOCALE_PATHS = [
    os.path.join(BASE_DIR,'locale')
]




LANGUAGE_CODE = 'en'

LANGUAGES = (
    ('en', 'English'),
    ('tr', 'Turkish'),
)

LANGUAGE_COOKIE_NAME='lang'


TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = False


STATIC_ROOT = os.path.join(BASE_DIR, "public/static/")

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'uploads')

]

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_AGE = 3600

# CSRF_TRUSTED_ORIGINS = ['https://www.payone.site', 'https://payone.site']

CSRF_TRUSTED_ORIGINS = ["https://www.payone.com.tr","https://payone.com.tr","http://172.18.0.2"]
CSRF_COOKIE_SECURE = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "https://payone.com.tr",
    # "https://api.example.com",
]
CORS_ALLOW_CREDENTITALS = True