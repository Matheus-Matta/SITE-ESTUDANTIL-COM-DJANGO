// para exibir uma messagem de erro no topo na pagina de login
export function popUpError(mensagem) {

    const div = document.createElement('div')

    div.style.backgroundColor = 'rgb(225, 97, 75)'
    div.style.padding = '5px 10px'
    div.style.margin = '10px auto'
    div.style.top = '5%'
    div.style.position = 'fixed'
    div.style.color = '#f1f1f1'
    div.style.fontSize = '22px'
    div.style.fontFamily = 'sans-serif'
    div.style.zIndex = '10'
    div.style.borderRadius = '10px'
    div.style.fontWeight = '600'

    div.innerHTML = mensagem

    const body = document.querySelector('body')
    body.appendChild(div)

    setTimeout(() => {
        div.remove();
    }, 5000)

}

// para usar na pagina de login como messagem de erro para os input de login e registro
export function input_invalid(input,message){

    // remove balao de msg anterior
    const msgAnteriores = document.querySelectorAll(".input-invalid")
    msgAnteriores.forEach((msg)=>{
        msg.remove();
    })

    // limpa a cor de erro dos input anteriores
    const inputErro = document.querySelector(".input_invalid_ativo")
    if(inputErro){
        inputErro.style.animation = '';
        inputErro.style.border = ''; 
        inputErro.classList.remove('input_invalid_ativo')
    }
    


    const time = 8000; // tempo para apagar o balao automaticamente
    const modal = document.querySelector("#modal-acesso")
   
    const x =  modal.offsetLeft + 350;

    const rect = input.getBoundingClientRect();
    const y = rect.top + window.scrollY + 9;

    const div = document.createElement("div")
    div.className = 'input-invalid'
    div.innerHTML = message
    div.style.right = `${x}px`;
    div.style.top = `${y}px`;
    div.style.animation = `fadeOut ${time / 1000}s ease-out`

    input.style.animation = `border_fadeOut ${time / 1000}s ease-out`
    input.classList.add('input_invalid_ativo')

    const body = document.querySelector('body')
    body.appendChild(div)

   // Inicia o setTimeout e salva o ID do temporizador em uma variável
    let timeoutId;

    div.addEventListener('mouseenter', () => {
        div.style.animation = 'none';
        input.style.border = '1px solid tomato';
        input.style.animation =  'none';
        clearTimeout(timeoutId);
    });

    div.addEventListener('mouseleave', () => {
        div.style.animation = `fadeOut ${time / 1000}s ease-out`;
        input.style.border = ''
        input.style.animation = `border_fadeOut ${time / 1000}s ease-out`
        iniciarTimeout();
    });

    iniciarTimeout();

    function iniciarTimeout() {
        timeoutId = setTimeout(() => {
        div.remove();
        input.style.animation = ''
        input.style.border = ''
        }, time);
    }
}