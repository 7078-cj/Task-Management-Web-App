from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Task, UserProfile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
       model = User
       fields = ('id', 'username', 'email', 'password','profile')
       extra_kwargs = {'password': {'write_only': True}}
       
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            
        )
        return user


    
class TaskSerializer(serializers.ModelSerializer):
    assignedTo = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Task
        fields = ['id', 'taskName', 'taskStatus','assignedTo']

class ProjectSerializer(serializers.ModelSerializer):
    
    projectTask = TaskSerializer(many=True, read_only=True)
    projectManager = UserSerializer(read_only=True)
    total_tasks = serializers.IntegerField( read_only=True)
    completed_tasks = serializers.IntegerField( read_only=True)

    class Meta:
        model = Project
        fields = ['id','projectName', 'projectManager', 'projectTask', 'total_tasks', 'completed_tasks']