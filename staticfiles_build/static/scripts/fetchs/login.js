import { popUpError, input_invalid } from "../objetos/error.js"; // (elemento , mensagem)
import { BASE_URL } from "../config.js";

function enviar_form_login(event) {
    event.preventDefault();
    const email = document.querySelector('#email-login')
    const senha = document.querySelector('#senha-login')
    
    // verificar email
    if(email.value == ''){
        input_invalid(email,'Email não esta preenchido')
        return 0;
    }
    // verificar senha 
    if(senha.value == ''){
        input_invalid(senha,'Senha não esta preenchida')
        return 0;
    }


    const formulario = document.querySelector('#login-form');
    const formData = new FormData(formulario);
 
    fetch(BASE_URL + "acesso/", {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            }
        })
        .then(data => {
            if (data && data.hasOwnProperty('success')) {
                if (data.success) {
                    window.location.href = data.url;
                } else {
                    if(data.tipo == 'email'){
                        input_invalid(email,data.message)
                    } else if (data.tipo == 'senha'){
                        input_invalid(senha,data.message)
                    } else if (data.tipo == 'ative'){
                        popUpError(data.message)
                    }
                }
            }

        })
        .catch(error => {
            console.error('Erro:', error);
        });


}

const btn_envio = document.querySelector("#btn_login")
btn_envio.addEventListener("click", enviar_form_login)
