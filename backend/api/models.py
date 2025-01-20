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
    
    @property
    def total_tasks(self):
        """Returns the total number of tasks for the project."""
        return self.projectTask.count()

    @property
    def completed_tasks(self):
        """Returns the number of completed tasks for the project."""
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
    assignedTo = models.ManyToManyField(User,related_name="members")
    
