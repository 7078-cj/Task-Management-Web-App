from django.urls import path
from .consumer import TaskConsumer,NotifConsumer

wspattern =[
    path("ws/project/<str:project_id>",TaskConsumer.as_asgi()),
    path("ws/notification/<str:user_id>",NotifConsumer.as_asgi())
]