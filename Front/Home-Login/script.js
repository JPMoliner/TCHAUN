import {getuser, updateuser, login} from "../API/api.js"

const login_button = document.getElementById("login_button")
const senha = document.getElementById("senha")
const login_text = document.getElementById("login")

const entrar_button = document.getElementById('entrar_button')
const modal = document.getElementById('janela-modal')


function abrirModal(){
    modal.classList.add('abrir')

    modal.addEventListener('click', (e) => {
        if(e.target.id == 'fechar' || e.target.id == `janela-modal`){
            modal.classList.remove(`abrir`)
        }
    })
}

entrar_button.addEventListener("click", abrirModal);


login_button.addEventListener("click", async function(event) {
    let info = {
        password: senha.value,
        login: login_text.value
    }

    let result = await login(info)

    console.log(result)

    if (result.status) { // N LOGO
        updateuser({})
    } else { // LOGO
        updateuser(result)
        window.location.href = "/TCHAUN/Front/Chat/chat.html"; 
    }

    console.log(getuser())
}) 