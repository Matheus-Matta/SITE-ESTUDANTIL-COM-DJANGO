
from django.http import JsonResponse
from django.shortcuts import render, redirect

from .models import Usuarios

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Permission

from .utils import email_confirmacao, email_recuperacao , signer_message

from django.core.signing import TimestampSigner, BadSignature, SignatureExpired,Signer

from django.template.loader import render_to_string


# render(request,pagina html)
# função para retorna uma pagina html na rota
# A pasta templates e essencial ( padrao para o django todo html tem que esta la)
def home(request):
    return render(request, './public/home.html')

#-----------------------------------------------------------------------------------------------------------------------      

    
def cad_usuario(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Método de requisição inválido.'})
       
    # Verifica se o e-mail já está cadastrado
    # Retorna True se o e-mail já existe, False caso contrário
    email = request.POST.get('email')
    user = Usuarios.objects.filter(email=email).first()
        
    if user:
        # ( resposta para o fetchs/cadastro.js ) error: email ja cadastrado
        return JsonResponse({'success': False, 'message': 'E-mail já cadastrado.'})
        
    # atribuindo os valores para ser salvo no banco de dados
    nome = request.POST.get('nome')
    sobrenome = request.POST.get('sobrenome')
    senha = request.POST.get('senha')

    # deixando a data de nascimento no padrao sql '0000-00-00' ano-mes-dia
    ano = request.POST.get('ano')
    mes = request.POST.get('mes')
    dia = request.POST.get('dia')
    nascimento = f'{ano}-{mes.zfill(2)}-{dia.zfill(2)}'
                
    # atribuindo os dados enviados no modelo de usuarios
    novo_user = Usuarios.objects.create_user(
        username=email,
        email=email,
        password=senha,
        first_name=nome,
        last_name=sobrenome,
        nascimento=nascimento,
        is_active=False
    )
    
    # salvando dados no sqlite    
    novo_user.save()
    
    # adicionando a permissão
    permission_aluno = Permission.objects.get(codename='acesso_aluno') # pegando a permissão de aluno no sqlite
    novo_user.user_permissions.add(permission_aluno) # adicionando a permissão de aluno
    
    # função para enviar o email de confirmação
    email_confirmacao(request,novo_user)
    
    # message para exibir na pagina
    # codificando para previnir erros e injeção de codigos maliciosos
    message = signer_message(f'<h4>Um e-mail de confirmação de conta foi enviado para esse endereço<br></h4><br><p>{email}</p>')
    
    # redirecionando para login com a messagem de verificação
    return JsonResponse({'success':True,'url':f'/login/?message={message}'}) 
   

#-----------------------------------------------------------------------------------------------------------------------  

# rota de login
def login_acesso(request):
    try:
        if request.user.is_authenticated:
            return redirect('login-redirect')
        # tratamento de messagem enviada para a pagina de login
        message = request.GET.get('message', False)
        if message:
            message = Signer().unsign(message)  # necessario para discriptografar
        return render(request, './public/login.html',{'message':message})
    
    except (BadSignature): 
        if BadSignature:
           return redirect('login')
#------------------------------------------------------------------------------

# view responsavel pela verificação de conta >> login <<
def dados_acesso(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'method invalido'})
    
    email = request.POST.get('email')
    senha =  request.POST.get('senha')
    manter_conectado = request.POST.get('manter-conectado')
    user = Usuarios.objects.filter(email=email).first()
    if user:
        if user.is_active:
            userAuth = authenticate(request, email=email, password=senha)
            if userAuth:
                login(request,user)
                if not manter_conectado: 
                    request.session.set_expiry(0) # expira  a sessão ao fechar o navegador 
                
                return JsonResponse({'success': True, 'url': '/login-redirect/'}) # '/login-redirect/' == login_redirect << view  
            
            return JsonResponse({'success': False, 'message': 'Senha incorreta' ,'tipo': 'senha'})   
        return JsonResponse({'success': False, 'message': 'Conta não esta ativa. Verifique seu Email', 'tipo': 'ative'})
    return JsonResponse({'success': False, 'message': 'Email esta incorreto','tipo': 'email'})    
#--------------------------------------------------------------------------

# rota de confirmação de conta
def ativar_conta(request, token):
    
    signer = TimestampSigner()
    # Verifica o token e obtém o e-mail
    email = signer.unsign(token, max_age= 60 * 60 * 2)  # Max age: 2 horas
    # Obtém o usuário com base no e-mail
    user = Usuarios.objects.filter(email=email).first()
    try:
        if user:
            # Ativar a conta
            user.is_active = True
            user.save()
             
            message = signer_message('Conta ativada com sucesso')
            return redirect(f'/login/?message={message}')
        else:
            # Se não existir o email, redirecionado para o login sem message
            return redirect('login')
        
    except (SignatureExpired, BadSignature):
        # link expirado
        if SignatureExpired:
            if user:
                email_confirmacao(email,user)
            message = signer_message('Ops, o link que você acessou expirou. Um novo e-mail foi enviado para você')
            return redirect(f'/login/?message={message}')
                
        # link invalido
        if BadSignature:
           message = signer_message('OPS... seu link e invalido')
           return redirect(f'/login/?message={message}')
#--------------------------------------------------------------------------
     
# view responsavel por verificar e redirecionar para a pagina de acordo com sua permissão 
def login_redirect(request):
    if request.user.is_authenticated:
        if request.user.has_perm('app_acad.acesso_aluno'):
            return redirect('login_aluno')
        elif request.user.has_perm("app_acad.acesso_admin"):
            return redirect('login_admin')
    else:     
        return  redirect('login')
#--------------------------------------------------------------------------


def login_aluno(request):
    if request.user.is_authenticated: 
        if request.user.has_perm("app_acad.acesso_aluno"):
            return render(request, 'public/aluno.html')
        
    return  redirect('login')
#--------------------------------------------------------------------------


def login_admin(request):
    if request.user.is_authenticated:
        if request.user.has_perm("app_acad.acesso_admin"):
            return render(request, 'public/admin.html')

    return redirect('login')
#--------------------------------------------------------------------------
    

def Solicitacao_Alteração_Senha(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Erro ao enviar sua solicitação'})    
        
    email = request.POST.get('email')
    user = Usuarios.objects.filter(email=email).first()
    if user:
        email_recuperacao(request,user)
        message = signer_message(f'<h4>Um Email foi enviado para</h4><br><p>{email}</p>')
        return JsonResponse({'success': True, 'url':f'/login/?message={message}'})
        
    return JsonResponse({'success': False, 'message': 'Email esta incorreto','tipo': 'email'})  
    
 
def Alteração_Senha_confirmada(request,token):
    signer = TimestampSigner()
    # Verifica o token e obtém o e-mail
    email = signer.unsign(token, max_age= 60 * 60 * 2)  # Max age: 2 horas
    # Obtém o usuário com base no e-mail
    user = Usuarios.objects.filter(email=email).first()
    try:
        if user:
            html_content = render_to_string('./public/ativação/recuperar_senha.html',{'email': email})
            message = signer_message(html_content)
            return redirect(f'/login/?message={message}')
        else:
            message = signer_message('Ops, ocorreu um erro! seu email não esta em nosso sistema')
            return redirect(f'/login/?message={message}')
        
    except (SignatureExpired, BadSignature):
        # link expirado
        if SignatureExpired:
            if user:
                message = signer_message('Ops, o link que você acessou expirou!')
                return redirect(f'/login/?message={message}') 
        # link invalido
        if BadSignature:
           message = signer_message('OPS... seu link e invalido')
           return redirect(f'/login/?message={message}')
       
def alterar_senha(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        nova_senha = request.POST.get('senha')
        user = Usuarios.objects.filter(email=email).first()
        if user:
            user.set_password(nova_senha)
            user.save()
            message = signer_message('Sua senha foi alterada com sucesso!')
            return JsonResponse({'success': True, 'url': f'/login/?message={message}'})
            
        return JsonResponse({'success': False, 'message': 'Seu email não existe em nosso sistema! Entre em contato conosco'})

    return JsonResponse({'success': False, 'message': 'Erro ao enviar sua solicitação'}) 
        