from rest_framework import serializers
from .models import User, Profile, Document, Schedule, UserRole
from django.contrib.auth.password_validation import validate_password

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name']
        read_only_fields = ['id']

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        
        # Créer le profil automatiquement
        Profile.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name
        )
        
        # Créer le rôle user par défaut
        UserRole.objects.create(user=user, role='user')
        
        return user

# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'user_email', 'first_name', 'last_name', 
                  'student_number', 'year', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

# Document Serializer
class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'description', 'semester', 'document_type', 
                  'file', 'file_url', 'file_name', 'uploaded_by', 'uploaded_by_name',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'uploaded_by', 'file_name', 'created_at', 'updated_at']
    
    def get_uploaded_by_name(self, obj):
        try:
            profile = obj.uploaded_by.profile
            return f"{profile.first_name} {profile.last_name}"
        except:
            return obj.uploaded_by.email
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None

# Schedule Serializer
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'year', 'day_of_week', 'start_time', 'end_time', 
                  'subject', 'room', 'professor', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

# UserRole Serializer
class UserRoleSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserRole
        fields = ['id', 'user', 'user_email', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']