import { popUpError, input_invalid } from "../objetos/error.js"; // (mensagem)
import { validarEmail, validarSenha, validarNome, validarDia, validarAno } from "../auxiliares/formValidacao.js";
import { btn_loading, del_btn_loading } from "../objetos/loading.js";
import { BASE_URL } from "../config.js";


let loading = document.querySelector('#box_loading_cadastro')

function enviar_form_recuperacao(event) {
    event.preventDefault();

    // verificar email
    const email = document.querySelector('#email_recuperacao_senha')
    if (email.value == '') {
        input_invalid(email, 'Email não esta preenchido')
        return 0;
    } else if (!validarEmail(email.value)) {
        input_invalid(email, 'Email inválido');
        return 0;
    }



    loading.style.display = 'flex'
    const formulario = document.querySelector('#recuperacao-form');
    const formData = new FormData(formulario);

    fetch(BASE_URL + "recuperar-senha/", {
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
                    popUpError(data.message)
                }
            }

            loading.style.display = 'none'

        })
        .catch(error => {
            console.error('Erro:', error);
            loading.style.display = 'none'
        });


}

const btn_envio = document.querySelector("#btn_recuperacao")
btn_envio.addEventListener("click", enviar_form_recuperacao)

const btn_alterar = document.querySelector("#btn_trocar_senha")
function enviar_form_alteracao(event) {
    event.preventDefault();

    // verificar senha 
    const senha = document.querySelector('#senha_recuperacao')
    const senhaRepetida = document.querySelector('#repetir_senha_recuperacao')
    if (senha.value == '') {
        input_invalid(senha, 'Senha não esta preenchida')
        return 0;
    } else if (senha.value.length < 8) {
        input_invalid(senha, 'Senha deve ter mais de 8 caracteres')
        return 0;
    } else if (!validarSenha(senha.value)) {
        input_invalid(senha, 'Senha deve conter ao menos um numero e uma letra')
        return 0;
    } else if (senha.value !== senhaRepetida.value) {
        input_invalid(senhaRepetida, "As senhas devem ser idênticas")
        return 0;
    }

    btn_loading(btn_alterar)
    const formulario = document.querySelector('#form_alterar_senha');
    const formData = new FormData(formulario);
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    fetch(BASE_URL + "alterar_senha/", {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: formData,
    }).then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
    }).then(data => {
        if (data && data.hasOwnProperty('success')) {
            if (data.success) {
                window.location.href = data.url;
            } else {
                popUpError(data.message)
            }
        }
        del_btn_loading(btn_alterar)
    }).catch(error => {
        console.error('Erro:', error);
        del_btn_loading(btn_alterar)
    });


}
if (btn_alterar) {
    btn_alterar.addEventListener("click", enviar_form_alteracao)
}
