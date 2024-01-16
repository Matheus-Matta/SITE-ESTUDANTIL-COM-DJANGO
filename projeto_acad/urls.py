
from django.urls import path
from app_acad import views
from django.contrib.auth.views import LogoutView


urlpatterns = [
# path(rota , view responsavel, nome de referencia)

    # pagina inicial 
    path('', views.home, name='home'),
    
    # path gerais da pagina de login
    path('login/', views.login_acesso, name='login'),
    # rota de cadastro ( responsavel pelo recebimento dos dados de cadastro)
    path('cadastro/',views.cad_usuario,name='dados-usuarios-registro'),
    # rota responsavel pela ativação da conta
    path('ativar-conta/<str:token>/', views.ativar_conta, name='ativar_conta'),
    # rota de dados do login ( responsavel pelo recebimento dos dados de login)
    path('acesso/',views.dados_acesso,name='dados-login'),
    # rota redirecionamento ( responsavel por redirecionar o usuario para pagina de sua permissao)
    path("login-redirect/",views.login_redirect,name='login-redirect'),
    # rotas para lidar com solicitaçoes de alteração de senha
    path('recuperar-senha/',views.Solicitacao_Alteração_Senha,name='Solicitacao_Alteração_Senha'),
    path('recuperar-senha/<str:token>/',views.Alteração_Senha_confirmada,name='Alteração_Senha_confirmada'),
    path('alterar_senha/',views.alterar_senha,name='alterar_senha'),
    #---------------------------------------------------------------------------------
    
    # acesso admin
    path('login/admin/',views.login_admin,name='login_admin'),
    # acesso aluno
    path('login/aluno/',views.login_aluno,name='login_aluno'),
    
    # rota de logout 
    path('logout/', LogoutView.as_view(), name='logout')
]
