from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import UserProjectsView, ProjectDetailView

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
    path('registerUser/',views.registerUser),
    path('users/<str:pk>/projects/', UserProjectsView.as_view(), name='user-projects'),
    path('projects/<str:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('all/user',views.AllUser),
    path('projectsassigned/<str:pk>/',views.UserProjectsAssigned),
    path('tasksassigned/<str:pk>/',views.UserTasksAssigned),
    path('notifications/<str:pk>/',views.UserNotifications),
    path('updateProfile/<str:pk>/',views.updateProfile),
    path('getProfile/<str:pk>/',views.userProfile),
    path('deleteNotification/<str:pk>/',views.deleteNotification),
    
]
