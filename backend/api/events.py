from django.db.models.signals import post_save,m2m_changed
from django.dispatch import receiver
from .models import Task,Notification,User   # Replace with your actual model
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync





@receiver(m2m_changed, sender=Task.assignedTo.through)
def task_assigned_signal(sender, instance, action, pk_set, **kwargs):
    if action == "post_add": 
        print(f"Newly assigned user IDs: {pk_set}")

        channel_layer = get_channel_layer()
        user_ids = list(pk_set) 

        for user_id in user_ids:
            user = User.objects.get(id=user_id)
            Notification.objects.create(user=user, message=f"New task assigned: {instance.taskName}",project=instance.project)

        async_to_sync(channel_layer.group_send)(
            "notifications",
            {
                "type": "send_notification",
                "message": f"New task assigned: {instance.taskName}",
                "assignedTo": user_ids,
            }
        )




        
        
         