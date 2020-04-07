from django.urls import re_path, path
from django.conf.urls import url
from .consumer import ChatConsumer

websocket_urlpatterns = [
    # path('ws/chat/<uri>/', ChatConsumer),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer),
]
