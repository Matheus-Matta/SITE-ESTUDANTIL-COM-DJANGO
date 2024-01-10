export function btn_loading(btn) {
    const div = document.createElement('div');
    div.className = 'btn-loading';
    const text = btn.innerText;
    btn.setAttribute('data-tx', text);
    btn.innerHTML = '';
    btn.appendChild(div);
}

export function del_btn_loading(btn) {
    const loading = btn.querySelector('.btn-loading');
    const originalText = btn.getAttribute('data-tx');
    btn.innerHTML = originalText;
    loading.remove();
}