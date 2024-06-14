import { getuser, updateuser, send_msg, start_chat, get_chat, get_chats, get_by_cpf, busca } from "../API/api.js";

let atual_user = {};
// Armazenar mensagens em um objeto
const conversations = {
    'Yuta': [],
    'Megan': []
};

let nick_to_chat_id = {

}

let clicked_chat_id
let last_clicked = {}

let chat_list = {

}

function getSelectedTags() { // retorna uma array com todas as tags selecionadas
    const checkboxes = document.querySelectorAll('input[name="tags"]:checked');
    const selectedTags = [];
    checkboxes.forEach((checkbox) => {
        selectedTags.push(checkbox.value);
    });
    return selectedTags;
}

function limparMensagens() {
    const mensagensDiv = document.querySelector('.messages');
    mensagensDiv.innerHTML = '';
}

// Função para adicionar uma nova mensagem dentro do elemento com a classe 'messages'
function adicionarMensagem(nomeUsuario, textoMensagem, avatarSrc = 'Pictures/user.png') {
    const mensagensDiv = document.querySelector('.messages');

    const novaMensagemDiv = document.createElement('div');
    novaMensagemDiv.classList.add('message');
    novaMensagemDiv.setAttribute('data-user', nomeUsuario);

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');
    
    const avatarImg = document.createElement('img');
    avatarImg.src = avatarSrc;
    avatarImg.alt = `Avatar de ${nomeUsuario}`;
    
    avatarDiv.appendChild(avatarImg);

    const friendDiv = document.createElement('div');
    friendDiv.classList.add('friend');

    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    userDiv.textContent = nomeUsuario;

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = textoMensagem;

    friendDiv.appendChild(userDiv);
    friendDiv.appendChild(textDiv);

    novaMensagemDiv.appendChild(avatarDiv);
    novaMensagemDiv.appendChild(friendDiv);

    mensagensDiv.appendChild(novaMensagemDiv);
}


export async function novo_chat(){ // função usada no botão de BUSCA, esta função busca, cria um novo chat e atualiza a lista de chats
    let tags = ""
    for (const tag of getSelectedTags()){
        tags = tags + tag + ","
    }
    let pessoa_ideal = await busca({tags:tags, cpf:atual_user.cpf})

    if (pessoa_ideal.status){ console.log(pessoa_ideal); return }// ninguem com essas tags 

    let result = await start_chat({
        cpf1:atual_user.cpf,
        cpf2:pessoa_ideal.cpf
    })
    console.log(result)

    if (result.status){ // deu erro

    } else { // crio um novo chat

    }
  
    update_chats()
}

export async function update_chats(){  // atualiza a lista de chats junto com suas mensagens
    atual_user = getuser();
    document.getElementById("usernick").innerHTML = `${atual_user.name}`;
    nick_to_chat_id = {}
    limparMensagens()
    chat_list = {}
    let chatids = await get_chats(atual_user)
    for (const chatid in chatids){
        chat_list[chatid] = await get_chat({chatid:chatid})
        let atualchat = chat_list[chatid]
        let another_user_cpf =  atualchat.users.cpf1 == atual_user.cpf ? atualchat.users.cpf2 : atualchat.users.cpf1
        let other_user = await get_by_cpf({cpf:another_user_cpf})
        if (!other_user.status){
            let lastmsg = atualchat.msgs[atualchat.msgs.length-1].msg
            nick_to_chat_id[other_user.nickname] = chatid
            adicionarMensagem(other_user.nickname, lastmsg ? lastmsg : 'Vamos conversar?')
        }
    }

    // Adicionar evento de clique para trocar de chat
    document.querySelectorAll('.message').forEach(message => {
        message.addEventListener('click', function() {
            openChat(this.dataset.user, this);
        });
    });

    if (last_clicked.user) {
        openChat(last_clicked.user, last_clicked.element)
    }


}

setInterval(update_chats, 2000);

// Função para abrir o chat de um usuário
export function openChat(user, element) {
    clicked_chat_id = nick_to_chat_id[user]
    last_clicked = {
        user: user,
        element: element,
    }
    document.querySelector('.chat-header .chat-user').textContent = user;
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = ''; // Limpar mensagens antigas

    // Destacar mensagem ativa
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => message.classList.remove('active'));
    element.classList.add('active');

    // Carregar mensagens da conversa
    chat_list[clicked_chat_id].msgs.forEach(messageData => {
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat-message', messageData.cpf === atual_user.cpf ? 'self' : 'other');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = messageData.msg;

  
        newMessage.appendChild(messageContent);
        chatMessages.appendChild(newMessage);
    });

    // Rolagem automática para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para enviar uma mensagem
export async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        let result = await send_msg({
            chatid:clicked_chat_id,
            msg: messageText,
            cpf: atual_user.cpf,
        })
        console.log(result)
    }
    update_chats()
}

// Função para enviar mensagem com a tecla Enter
document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Função para sair (simulada)
export function logout() {
    updateuser({});
    alert('Você saiu.');
    window.location.href = "/TCHAUN/Front/Home-Login/index.html"; 
}



// Função para mostrar a área de Matches
export function showMatches() {
    document.querySelector('.main-chat').classList.remove('active');
    document.querySelector('.main-matches').classList.add('active');
}

// Função para mostrar a área de Mensagens
export function showMessages() {
    document.querySelector('.main-matches').classList.remove('active');
    document.querySelector('.main-chat').classList.add('active');
}



// Adicionar evento de clique para alterar a cor das tags
document.querySelectorAll('.tags input').forEach(input => {
    input.addEventListener('change', function() {
        if (this.checked) {
            this.parentElement.classList.add('selected');
        } else {
            this.parentElement.classList.remove('selected');
        }
    });
});