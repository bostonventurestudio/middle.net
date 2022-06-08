# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#  Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

from django.conf import settings
from django.core.cache import cache

INSTANT_CACHE_TIMEOUT = 60 * 60
DEFAULT_CACHE_TIMEOUT = INSTANT_CACHE_TIMEOUT * 24
LONG_CACHE_TIMEOUT = DEFAULT_CACHE_TIMEOUT * 30


def set_default_cache(key, value, timeout=DEFAULT_CACHE_TIMEOUT):
    """
    Set cache for regular time.

    :param key:
    :param value:
    :param timeout:
    :return:
    """
    cache.set(key, value, timeout)


def set_instant_cache(key, value):
    """
    Set cache for short time.

    :param key:
    :param value:
    :return:
    """
    cache.set(key, value, INSTANT_CACHE_TIMEOUT)


def set_long_cache(key, value):
    """
    Set cache for long time.

    :param key:
    :param value:
    :return:
    """
    cache.set(key, value, LONG_CACHE_TIMEOUT)


def clear_key_cache(key):
    """
    Clear Key Cache.

    :param key:
    :return:
    """
    if cache.get(key):
        cache.delete(key)


def get_cache_key(key):
    """
    Clear Unique Cache Prefix.

    :param key:
    :return:
    """
    return '{}.{}'.format(settings.CACHE_PREFIX_KEY, key)


def flush():
    """
    Clear all cache.

    :return:
    """
    cache.clear()
