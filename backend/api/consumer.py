import json
from  channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async,sync_to_async
from .models import Project,Task,User,Notification
from .serializer import TaskSerializer,NotificationSerializer
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
            
            
            event = {
                "type":"delete_task",
                "data":data
            }
           
            await self.channel_layer.group_send(self.project_name,event)
            
    async def create_task(self,event):
       
        outer_data = event["data"]
        
        data = outer_data["data"]
        
       
       
        task = await self.create_taskdb(data=data)
        
        response = {
        'task': task
        }
       
    
   
        await self.send(text_data=json.dumps({"create_task": response}))
        
    @database_sync_to_async
    def create_taskdb(self,data):
        
        
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
    
    async def update_task(self,event):
        
        outer_data = event["data"]
        
        data = outer_data["data"]
        
        
        task = await self.update_taskdb(data=data)
        
         
        response = {
        'task': task
        }
        
    
   
        await self.send(text_data=json.dumps({"update_task": response}))
        
    @database_sync_to_async
    def update_taskdb(self,data):
        
        
        project = Project.objects.get(id=self.project_id)
        task = Task.objects.get(id=data["taskID"])
        if(task):
            task.taskName=data["taskName"]
            task.taskDescription=data["taskDescription"]
            task.taskStatus=data["taskStatus"]
            task.save()
   
            
        
        task_data =  TaskSerializer(task).data
        
        
        return task_data
    
    async def delete_task(self,event):
       
        outer_data = event["data"]
        
        data = outer_data["data"]
        
        
        
        taskID = await self.delete_taskdb(data=data)
        
         
        response = {
        'taskID': taskID
        }
        
    
   
        await self.send(text_data=json.dumps({"delete_task": response}))
        
    @database_sync_to_async
    def delete_taskdb(self,data):
        
        
        
        task = Task.objects.get(id=data)
        if(task):
            task = task.delete()
   
            
        
        
        return data
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.project_name,self.channel_name)
        
        self.close(code)


@database_sync_to_async
def get_user_by_id(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


@database_sync_to_async
def get_notifications(user):
    notifications = Notification.objects.filter(user=user).order_by('-created', '-update')
    return NotificationSerializer(notifications, many=True).data
      
class NotifConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        
        
        await self.channel_layer.group_add("notifications",self.channel_name)
        
        await self.accept()
    
    

    async def send_notification(self, event):
        if int(self.user_id) in event["assignedTo"]:
           
            user = await get_user_by_id(self.user_id)
            if not user:
                return  
            notifications = await get_notifications(user)
            response = {'notifs': notifications} 
            print(response)

            await self.send(text_data=json.dumps(response))

    
    
                
            
            
    
        
    async def disconnect(self, code):
        await self.channel_layer.group_discard("notifications",self.channel_name)
        
        self.close(code)