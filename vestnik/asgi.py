# mysite/asgi.py
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vestnik.settings")

from messenger import routing

django_asgi_application = get_asgi_application()

application = ProtocolTypeRouter(
    {
      'http': django_asgi_application,
      'websocket' : AllowedHostsOriginValidator(
          AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))
      )
    }
)