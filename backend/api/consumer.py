import json
from  channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async,sync_to_async
from .models import Project,Task,User
from .serializer import TaskSerializer
from django.forms.models import model_to_dict
#import models

class TaskConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        self.project_name = f"project_{self.scope['url_route']['kwargs']['project_id']}"
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        
        
        await self.channel_layer.group_add(self.project_name,self.channel_name)
        
        await self.accept()
        
    async def receive(self, text_data):
        
        data = json.loads(text_data)
        action = data.get('action')
        print(data)
         

        if action == 'create':
             
            
            event = {
                "type":"create_task",
                "data":data
            }
           
            await self.channel_layer.group_send(self.project_name,event)
            
            
        elif action == 'update':
             
            
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
        print(event)
        outer_data = event["data"]
        print(outer_data)
        data = outer_data["data"]
        print(data)
        print(data["taskName"])
       
       
        task = await self.create_taskdb(data=data)
        
        response = {
        'task': task
        }
        print(f'serializer:{task}')
    
   
        await self.send(text_data=json.dumps({"create_task": response}))
        
    @database_sync_to_async
    def create_taskdb(self,data):
        print(data)
        
        project = Project.objects.get(id=self.project_id)
        task = Task.objects.create(
        project=project,
        taskName=data['taskName'],
        taskDescription=data['taskDescription'],
        taskStatus=data['taskStatus']
    )
        for user_id in data["assignedTo"]:
            user = User.objects.get(id=user_id)
            task.assignedTo.add(user)
            
        
        task_data =  TaskSerializer(task).data
        
        
        return task_data
    
    
        
           
        
        
        
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.project_name,self.channel_name)
        
        self.close(code)