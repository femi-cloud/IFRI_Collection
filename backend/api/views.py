from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Profile, Document, Schedule, UserRole
from .serializers import (
    UserSerializer, RegisterSerializer, ProfileSerializer,
    DocumentSerializer, ScheduleSerializer, UserRoleSerializer
)
from .permissions import IsAdmin, IsOwnerOrReadOnly
from django.contrib.auth import get_user_model
import requests as http_requests
from django.http import HttpResponse 
import cloudinary
import cloudinary.api

# Authentication Views

from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Inscription d'un nouvel utilisateur"""
    
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Utilisateur créé avec succès'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Connexion d'un utilisateur"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email et mot de passe requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authentifier directement avec l'email
    user = authenticate(email=email, password=password)  # ← CHANGÉ ICI
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        
        # Vérifier si admin
        is_admin = UserRole.objects.filter(user=user, role='admin').exists()
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'is_admin': is_admin,
            'message': 'Connexion réussie'
        })
    
    return Response(
        {'error': 'Email ou mot de passe incorrect'},
        status=status.HTTP_401_UNAUTHORIZED
    )
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Déconnexion (blacklist le refresh token)"""
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Déconnexion réussie'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Récupérer l'utilisateur connecté"""
    user = request.user
    is_admin = UserRole.objects.filter(user=user, role='admin').exists()
    
    return Response({
        'user': UserSerializer(user).data,
        'is_admin': is_admin
    })

# Profile ViewSet
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Les utilisateurs peuvent voir tous les profils
        return Profile.objects.all()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Récupérer le profil de l'utilisateur connecté"""
        try:
            profile = request.user.profile
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profil non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

# Document ViewSet
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        queryset = Document.objects.all()
        
        # Filtres optionnels
        semester = self.request.query_params.get('semester')
        document_type = self.request.query_params.get('type')
        
        if semester:
            queryset = queryset.filter(semester=semester)
        if document_type:
            queryset = queryset.filter(document_type=document_type)
        
        return queryset
    
    def perform_create(self, serializer):
        # Sauvegarder avec l'utilisateur connecté
        file = self.request.FILES.get('file')
        serializer.save(
            uploaded_by=self.request.user,
            file_name=file.name if file else ''
        )
        
    def create(self, request, *args, **kwargs):
        print("🔍 Upload reçu:")
        print("  Données:", request.data)
        print("  Fichiers:", request.FILES)
        
        return super().create(request, *args, **kwargs)
    
    # Dans DocumentViewSet, ajoutez ceci dans la méthode create :
    def create(self, request, *args, **kwargs):
        print("🔍 Upload reçu:")
        print(f"Données: {request.data}")
        print(f"Fichiers: {request.FILES}")
        
        response = super().create(request, *args, **kwargs)
        
        print(f"✅ Document créé:")
        print(f"File URL: {response.data.get('file')}")
        
        return response

# Schedule ViewSet
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
    def get_permissions(self):
        # Tout le monde peut voir, seuls les admins peuvent modifier
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdmin]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Schedule.objects.all()
        
        # Filtre par année
        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(year=year)
        
        return queryset

# UserRole ViewSet
class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_document(request, doc_id):
    try:
        doc = Document.objects.get(id=doc_id)
        
        # Générer une URL signée avec attachment
        url = cloudinary.utils.cloudinary_url(
            doc.file.name,
            resource_type='image',
            type='upload',
            sign_url=True,
            secure=True,
            flags='attachment'
        )[0]
        
        print(f"🔐 URL signée: {url}")
        
        # Télécharger le fichier
        response = http_requests.get(url, timeout=30)
        print(f"📡 Status: {response.status_code}")
        
        if response.status_code == 200:
            http_response = HttpResponse(
                response.content,
                content_type='application/pdf'
            )
            http_response['Content-Disposition'] = f'attachment; filename="{doc.file_name}"'
            return http_response
        
        return Response({
            'error': f'Cloudinary error {response.status_code}',
            'url': url
        }, status=400)
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return Response({'error': str(e)}, status=500)