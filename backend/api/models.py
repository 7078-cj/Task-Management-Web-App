from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile')
    profilePic = models.ImageField(null=True,default="null.jpg")
    bio = models.TextField(null=True)
    
class Project(models.Model):
    projectName = models.CharField(max_length=50)
    projectManager = models.ForeignKey(User,on_delete=models.CASCADE,related_name="manager")
    update = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
    @property
    def total_tasks(self):
        return self.projectTask.count()

    @property
    def completed_tasks(self):
        return self.projectTask.filter(taskStatus=Task.StatusChoice.COMPLETED).count()

class Task(models.Model):
    class StatusChoice(models.TextChoices):
        PENDING = 'P','Pending'
        INPROGRESS = 'IP','In Progress'
        ONHOLD = 'OH','On Hold'
        COMPLETED = 'C','Completed'
        
        
    project = models.ForeignKey(Project,related_name='projectTask',on_delete=models.CASCADE)
    taskName = models.CharField(max_length=50)
    taskDescription = models.CharField(max_length=50)
    taskStatus= models.CharField(max_length=20, choices=StatusChoice.choices)
    assignedTo = models.ManyToManyField(User,related_name="tasks")
    update = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
class Notification(models.Model):
    user = models.ForeignKey(User,related_name="notif",on_delete=models.Case)
    message = models.CharField(max_length=50)
    project = models.ForeignKey(Project,related_name='project',on_delete=models.CASCADE)
    update = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
