
from django.conf import settings
from django.core.signing import TimestampSigner, Signer
from django.urls import reverse
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives

email_host_user = settings.EMAIL_HOST_USER
  
def email_confirmacao(request,user):
    
    # Cria um TimestampSigner ( serve para criar um tempo para expirar o link )
    signer = TimestampSigner()
    # Gera o token assinado com o e-mail do usuário( para por na url)
    token = signer.sign(user.email)
    # Monta o URL de ativação usando o token ( cria um url especifica para cada usuario )
    activation_link = request.build_absolute_uri(reverse('ativar_conta', args=[token]))
    
    html_content = render_to_string('./public/ativação/email_validação.html',{'url':activation_link,'nome':user.first_name})
    text_content = strip_tags(html_content)
    
    # config email 
    assunto = 'Confirme sua conta' # assunto 
    remetente = email_host_user # email da minha empresa 
    destinatario = [user.email] # email do usuario
    
    # enviando o email com ma função padrao do django 
    send_email = EmailMultiAlternatives(assunto,text_content,remetente,destinatario)
    send_email.attach_alternative(html_content,'text/html')
    send_email.send();

def email_recuperacao(request,user):
     # Cria um TimestampSigner ( serve para criar um tempo para expirar o link )
    signer = TimestampSigner()
    # Gera o token assinado com o e-mail do usuário( para por na url)
    token = signer.sign(user.email)
    # Monta o URL de ativação usando o token ( cria um url especifica para cada usuario )
    recuperarSenha_link = request.build_absolute_uri(reverse('Alteração_Senha_confirmada', args=[token]))
    
    html_content = render_to_string('./public/ativação/email_recuperacao.html',{'url':recuperarSenha_link,'nome':user.first_name})
    text_content = strip_tags(html_content)
    
    # config email 
    assunto = f'Processo de Recuperação de Senha - {user.first_name} {user.last_name}' # assunto 
    remetente = email_host_user # email da minha empresa 
    destinatario = [user.email] # email do usuario
    
    # enviando o email com ma função padrao do django 
    send_email = EmailMultiAlternatives(assunto,text_content,remetente,destinatario)
    send_email.attach_alternative(html_content,'text/html')
    send_email.send();

def signer_message(message):
    signer = Signer()
    msg_signer = signer.sign(message)
    return msg_signer
        
   