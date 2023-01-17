# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

from datetime import timedelta


SECRET_KEY = '---'
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ]
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'middle',
        'USER': 'davidliu',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {'init_command': 'SET default_storage_engine=INNODB; SET TRANSACTION ISOLATION LEVEL SERIALIZABLE',
                    'charset': 'utf8mb4'},
    },


}
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
LOG_ROOT = os.path.join("c:/logs")
LOGGING_ROOT = LOG_ROOT
