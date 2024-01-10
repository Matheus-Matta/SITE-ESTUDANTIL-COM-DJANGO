from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from .models import Usuarios

# pegando as definiçoes do modelo de usuarios com content_type
content_type = ContentType.objects.get_for_model(Usuarios)

# criando a permissão de acesso dos alunos
codename_aluno = 'acesso_aluno'
if not Permission.objects.filter(content_type=content_type, codename=codename_aluno).exists():
        # Criando a permissão apenas se não existir
        permission_alunos = Permission.objects.create(
            codename=codename_aluno,
            name='Permissão para acessar o dashboard do aluno',
            content_type=content_type,
        )
        
# criando a permissão de acesso do administrador
codename_admin = 'acesso_admin'
if not Permission.objects.filter(content_type=content_type, codename=codename_admin).exists():
        # Criando a permissão apenas se não existir
        permission_admin = Permission.objects.create(
            codename=codename_admin,
            name='Permissão para acessar o dashboard do administrador',
            content_type=content_type,
        )