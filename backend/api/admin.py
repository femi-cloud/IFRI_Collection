from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, Document, Schedule, UserRole

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'is_staff', 'is_active']
    list_filter = ['is_staff', 'is_active']
    search_fields = ['email', 'username']

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'student_number', 'year', 'created_at']
    list_filter = ['year']
    search_fields = ['first_name', 'last_name', 'student_number']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'document_type', 'semester', 'uploaded_by', 'created_at']
    list_filter = ['document_type', 'semester']
    search_fields = ['title', 'description']

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['subject', 'day_of_week', 'start_time', 'end_time', 'year', 'professor']
    list_filter = ['year', 'day_of_week']
    search_fields = ['subject', 'professor', 'room']

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'created_at']
    list_filter = ['role']
    search_fields = ['user__email']