from rest_framework import permissions
from .models import UserRole

class IsAdmin(permissions.BasePermission):
    """
    Permission pour vérifier si l'utilisateur est admin
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return UserRole.objects.filter(
            user=request.user,
            role='admin'
        ).exists()

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission pour permettre seulement au propriétaire de modifier
    """
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture seulement pour le propriétaire
        return obj.uploaded_by == request.user