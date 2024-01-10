
export function validarEmail(email) {
    const caracteres = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contem = caracteres.test(email)
    return contem;
}

export function validarSenha(senha) {
    const possuiNumero = /\d/.test(senha);
    const possuiLetra = /[a-zA-Z]/.test(senha);
    return possuiNumero && possuiLetra;
}

// Verifica se o nome contém espaços em branco
export function validarNome(nome) {
    if (nome.indexOf(' ') !== -1 || nome == '') {
        return false;
    } 
    return true; 
}
// Valida se o dia é válido para o mês selecionado
export function validarDia(dia,mes,ano) {
    if( dia == '' || ano == ''){
        return false;
    }
    const diasDoMes = new Date(ano, mes, 0).getDate();
    if(dia >= 1 && dia <= diasDoMes){
        return true;
    }
    return false;
}

export function validarAno(ano) {
    if(!Number.isInteger(ano) || ano == 0){
        return false;
    }
    const anoAtual = new Date().getFullYear();
    const anoMinimo = anoAtual - 100;
    if(ano < anoAtual || ano > anoMinimo){
        const idade = anoAtual - ano;
        if(idade >= 17 ){
           return true;
        }
        return false;
    }
    return false;
}