from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Router pour les ViewSets
router = DefaultRouter()
router.register(r'profiles', views.ProfileViewSet, basename='profile')
router.register(r'documents', views.DocumentViewSet, basename='document')
router.register(r'schedules', views.ScheduleViewSet, basename='schedule')
router.register(r'user-roles', views.UserRoleViewSet, basename='userrole')

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.current_user, name='current_user'),
    
    # ViewSets routes
    path('', include(router.urls)),
]