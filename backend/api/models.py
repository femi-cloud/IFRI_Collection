from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary_storage.storage import MediaCloudinaryStorage  
import uuid

# Custom User Model
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'auth_user'

# Profile Model
class Profile(models.Model):
    YEAR_CHOICES = [(i, f"Année {i}") for i in range(1, 4)]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    student_number = models.CharField(max_length=50, blank=True, null=True)
    year = models.IntegerField(choices=YEAR_CHOICES, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'profiles'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

# Document Model
class Document(models.Model):
    DOCUMENT_TYPES = [
        ('examen', 'Examen'),
        ('td', 'TD'),
        ('tp', 'TP'),
        ('cours', 'Cours'),
        ('autre', 'Autre'),
    ]
    
    SEMESTER_CHOICES = [(i, f"Semestre {i}") for i in range(1, 7)]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    semester = models.IntegerField(choices=SEMESTER_CHOICES)
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='%Y/%m/',
                            storage=MediaCloudinaryStorage())
    file_name = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

# Schedule Model
class Schedule(models.Model):
    DAYS_OF_WEEK = [
        ('Lundi', 'Lundi'),
        ('Mardi', 'Mardi'),
        ('Mercredi', 'Mercredi'),
        ('Jeudi', 'Jeudi'),
        ('Vendredi', 'Vendredi'),
        ('Samedi', 'Samedi'),
    ]
    
    YEAR_CHOICES = [(i, f"Année {i}") for i in range(1, 4)]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    year = models.IntegerField(choices=YEAR_CHOICES)
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    subject = models.CharField(max_length=255)
    room = models.CharField(max_length=100)
    professor = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'schedules'
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.subject} - {self.day_of_week} {self.start_time}"

# UserRole Model
class UserRole(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roles')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_roles'
        unique_together = ['user', 'role']
    
    def __str__(self):
        return f"{self.user.email} - {self.role}"