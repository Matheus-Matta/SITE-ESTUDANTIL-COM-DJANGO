from django.contrib.auth.models import AbstractUser, BaseUserManager,PermissionsMixin
from django.contrib.auth import authenticate, login
from django.db import models


class UsuariosManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O campo de e-mail deve ser definido')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)
    
    
class Usuarios(AbstractUser,PermissionsMixin):
    cpf = models.TextField(max_length=11, blank=True, null=True)
    telefone = models.TextField(max_length=9, blank=True, null=True)
    endereco = models.TextField(max_length=200, blank=True, null=True)
    username = models.TextField(unique=True, blank=True, null=True, default='') 
    nascimento = models.DateField(null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    
    objects = UsuariosManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def authenticate(self, email, password):
        user = authenticate(email=email, password=password)
        return user

    def login(self, request, user):
        login(request, user)
    
    
    def __str__(self):
        return self.first_name + ' ' + self.last_name
    
    
    
    

   
 
    

