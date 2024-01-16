function alterColorMenu(){
    const itens = document.querySelectorAll(".admin-menu .menu-itens")
    function ativo(item){
        const icon = item.querySelector("img")
        const url = icon.src.replace("/575757/","/ff6347/")
        icon.src = url
        item.style.color = "#ff6347"
        item.style.backgroundColor = '#f1f1f1'
        if(item.classList.contains("menu-item-ativo")){
            item.style.borderLeft = "3px solid #ff6347"
        }
    }
    function inativo(item){
        const icon = item.querySelector("img")
        const url = icon.src.replace("/ff6347/","/575757/")
        icon.src = url
        item.style.color = "#575757"
        item.style.backgroundColor = ''
        item.style.borderLeft = ""

    }
    itens.forEach((item)=>{
        item.addEventListener("mouseover",()=>{
            ativo(item)
        })
        item.addEventListener("mouseout",()=>{
            if(!item.classList.contains("menu-item-ativo")){
                inativo(item)
            }
        })
        item.addEventListener("click",()=>{
            itens.forEach((item)=>{
                if(item.classList.contains("menu-item-ativo")){
                    item.classList.remove("menu-item-ativo")
                     inativo(item)
                }
            })
            item.classList.add("menu-item-ativo")
            ativo(item);
        })
    })

    const home = document.querySelector("#admin-home")
    home.classList.add("menu-item-ativo")
    ativo(home);
}
alterColorMenu();

function alterMenuUsuario(){
    const itens = document.querySelectorAll(".admin-dashbord-usuarios .menu-usuarios p")
    function ativo(item){
       item.style.color = "#ff6347"
       item.style.borderBottom = '3px solid #ff6347'
    }
    function inativo(item){
        item.style.color = "#979797"
        item.style.borderBottom = ''
    }
    itens.forEach((item)=>{
        ativo(itens[0])
        item.addEventListener("click",()=>{
            itens.forEach((item)=>{
                item.classList.remove("menu-item-ativo")
                inativo(item);
            })
            item.classList.add("menu-item-ativo")
            ativo(item);
        })
    })
}
alterMenuUsuario()

function alterListaUsuarios(){
    const itens = document.querySelectorAll(".admin-dashbord-usuarios .menu-usuarios p")
    function ativo(item){
        const dataId = item.getAttribute('data-id');
        const listas = document.querySelectorAll(".menu-usuarios-alunos .lista-de-usuarios tbody")
        listas.forEach((lista)=>{
            const id = lista.getAttribute('id');
            if(dataId == id){
                lista.style.display = "table-row-group"     
            } else {
                lista.style.display = "none"
            }
        })
    }
    itens.forEach((item)=>{
        ativo(itens[0]);
        item.addEventListener("click",()=>{
            ativo(item);
        })
    }) 
}
alterListaUsuarios();