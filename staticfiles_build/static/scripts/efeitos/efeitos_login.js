
function clearMessageParameter() {
    var newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newURL }, '', newURL);
}
clearMessageParameter();

function revelarSenha(){
    const btns = document.querySelectorAll('.input_senha img')
    btns.forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const pass = btn.nextElementSibling;
            if(btn.classList.contains('btnRevelar_ativo')){
                pass.setAttribute('type','password')
                btn.setAttribute('src','https://img.icons8.com/ios/50/4a4a4a/closed-eye.png')
                btn.classList.remove('btnRevelar_ativo');
            } else {
                pass.setAttribute('type','text')
                btn.setAttribute('src','https://img.icons8.com/pastel-glyph/64/4a4a4a/surprise--v2.png')
                btn.classList.add('btnRevelar_ativo');
            }
        })
    })
}
revelarSenha();

function fechar_modal_msg(){
    const modal = document.querySelector("#modal_msg")
    if(modal){
        modal.addEventListener("click",(event)=>{
            if (event.target.id === 'modal_msg') {
                modal.style.display = 'none'
            }
        })
    }
}
fechar_modal_msg();