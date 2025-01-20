import json
from  channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async,sync_to_async
from .models import Project
from .serializer import TaskSerializer
#import models

class TaskConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        self.project_name = f"project_{self.scope['url_route']['kwargs']['project_id']}"
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.project = await sync_to_async(Project.objects.get)(id=self.project_id)
        
        await self.channel_layer.group_add(self.project_name,self.channel_name)
        
        await self.accept()
        
    async def receive(self, text_data):
        
        data = json.loads(text_data)
         

        if action == 'create':
            action = data.get('action') 
            
            event = {
                "type":"create_task",
                "data":data
            }
           
            await self.channel_layer.group_send(self.project_name,event)
            
            
        elif action == 'update':
            action = data.get('action') 
            
            event = {
                "type":"update_task",
                "data":data
            }
           
            await self.channel_layer.group_send(self.project_name,event)
            
        elif action == 'delete':
            id = data.get('id')
            
            event = {
                "type":"delete_task",
                "id":id
            }
           
            await self.channel_layer.group_send(self.project_name,event)
            
    async def create_task(self,event):
        data = event[data]
        await self.create_taskdb(data=data)
        
        response ={
            'task' : data
        }
        
        await self.send(text_data=json.dumps({"create_data":response}))
        
    @database_sync_to_async
    def create_taskdb(self,data):
        print(data)
        data['project'] = self.project
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
           
        
        
        
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.project_name,self.channel_name)
        
        self.close(code)