from django.shortcuts import render
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import Token
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from .serializer import UserSerializer,TaskSerializer,ProjectSerializer,ProfileSerializer,NotificationSerializer

from .models import Project, Task,UserProfile, Notification
from django.contrib.auth.models import User

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

# Create your views here.
# CustomToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
     if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            UserProfile.objects.create(user=user)
            
            return Response({'message': 'User registered successfully'})
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def userProfile(request,pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)

@api_view(['PUT'])
def updateProfile(request,pk):
    user = User.objects.get(id=pk)
    data = request.data.copy()  
    if  data.get("profilePic") == "undefined":
        data.pop("profilePic")
    

    serializer = ProfileSerializer(instance=user.profile, data=data, partial=True)

    if serializer.is_valid():
        if user.profile.profilePic and data.get("profilePic") != "undefined":
            user.profile.profilePic.delete(save=False)
        serializer.save()
        return Response(serializer.data)
    
    else:
        return Response(serializer.errors)

# @api_view(['GET'])
# def getUserProjects(request):
#     userProjects = User.manager.all()
#     serializer = ProjectSerializer(userProjects,many=True)
    
#     return Response(serializer.data)

# @api_view(['POST'])
# def createProject(request):
#     serializer = ProjectSerializer(data=request.data)
    
#     if serializer.is_valid():
#         serializer.save
#         return Response('project created')
    
#     else:
#         return Response(serializer.errors)

# @api_view(['PUT'])
# def updateProject(request,pk):
#     project = Project.objects.get(id=pk)
#     serializer = ProfileSerializer(instance=project,data=request.data,partial=True)
    
#     if serializer.is_valid():
#         serializer.save
#         return Response('project updated')
    
#     else:
#         return Response(serializer.errors)

@api_view(['DELETE'])
def deleteNotification(request,pk):
    notification = Notification.objects.get(id=pk)
    notification.delete()
    
    return Response("notification deleted")

class UserProjectsView(ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get("pk")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Project.objects.none()  
        return user.manager.all().order_by('-created', '-update')  

    def perform_create(self, serializer):
        print(f"Request data: {self.request.data}") 
        user_id = self.kwargs.get("pk")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("User not found")
        
        
        serializer.save(projectManager=user)
        
class ProjectDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        
        project_id = self.kwargs.get("pk")
        return get_object_or_404(Project, id=project_id)

    def perform_update(self, serializer):
        
        serializer.save()

    def perform_destroy(self, instance):
    
        instance.delete()


@api_view(['GET'])        
def AllUser(request):
    
    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    
    
    return Response(serializer.data)

@api_view(['GET'])        
def UserProjectsAssigned(request,pk):
    user = User.objects.get(id=pk)
    user_projects = Project.objects.filter(projectTask__assignedTo=user).distinct().order_by('-created', '-update')
    serializer = ProjectSerializer(user_projects,many=True)
    
    
    return Response(serializer.data)

@api_view(['GET'])        
def UserTasksAssigned(request,pk):
    user = User.objects.get(id=pk)
    tasks = user.tasks.all().order_by('-created', '-update')
    serializer = TaskSerializer(tasks,many=True)
    
    
    return Response(serializer.data)

@api_view(['GET'])        
def UserNotifications(request,pk):
    user = User.objects.get(id=pk)
    notifs = user.notif.all().order_by('-created', '-update')
    serializer = NotificationSerializer(notifs,many=True)
    
    
    return Response(serializer.data)



    
    

    
