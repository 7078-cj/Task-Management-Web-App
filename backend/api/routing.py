from django.urls import path
from .consumer import TaskConsumer

wspattern =[
    path("ws/project/<str:project_id>",TaskConsumer.as_asgi())
]