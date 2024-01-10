import { popUpError, input_invalid } from "../objetos/error.js"; // (mensagem)
import { validarEmail,validarSenha,validarNome,validarDia,validarAno } from "../auxiliares/formValidacao.js"; 
import { BASE_URL } from "../config.js";


let loading = document.querySelector('#box_loading_cadastro')

function enviar_form_cadastro(event) {
    event.preventDefault();

    const nome = document.querySelector('#nome_registro')
    if(!validarNome(nome.value)){
       input_invalid(nome,"O nome não pode estar vazio ou conter espaços.")
       return 0;
    }

    const sobrenome = document.querySelector('#sobrenome_registro')
    if(!validarNome(sobrenome.value)){
        input_invalid(sobrenome,"O sobrenome não pode estar vazio ou conter espaços.")
        return 0;
    }
    
    // verificar email
    const email = document.querySelector('#email_registro')
    if(email.value == ''){
        input_invalid(email,'Email não esta preenchido')
        return 0;
    } else if (!validarEmail(email.value)) {
        input_invalid(email, 'Email inválido');
        return 0;
    }

    // verificar senha 
    const senha = document.querySelector('#senha_registro')
    const senhaRepetida =  document.querySelector('#verificarSenha_registro')
    if(senha.value == ''){
        input_invalid(senha,'Senha não esta preenchida')
        return 0;
    } else if(senha.value.length < 8){
        input_invalid(senha,'Senha deve ter mais de 8 caracteres')
        return 0;
    } else if (!validarSenha(senha.value)){
        input_invalid(senha,'Senha deve conter ao menos um numero e uma letra')
        return 0;
    } else if(senha.value !== senhaRepetida.value){
        input_invalid(senhaRepetida,"As senhas devem ser idênticas")
        return 0; 
    }

    const dia = document.querySelector('#dataDia_registro')
    const mes = +document.querySelector('#nascimento-mes').value
    const ano = document.querySelector('#dataAno_registro')

    const anoValue = +ano.value
    if(!validarAno(anoValue)){
        input_invalid(ano,'Ano de nascimento inválido')
        return 0;
    }
    const diaValue = +dia.value
    if(!validarDia(diaValue,mes,anoValue)){
        input_invalid(dia,'Dia do nascimento inválido')
        return 0;
    }



    loading.style.display = 'flex'
    const formulario = document.querySelector('#registro-form');
    const formData = new FormData(formulario);

    fetch(BASE_URL + "cadastro/", {
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
                    input_invalid(email,data.message)
                }
            }

            loading.style.display = 'none'

        })
        .catch(error => {
            console.error('Erro:', error);
            loading.style.display = 'none' 
        });


}

const btn_envio = document.querySelector("#btn_envio")
btn_envio.addEventListener("click",enviar_form_cadastro)

