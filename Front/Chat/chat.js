import { getuser, updateuser, send_msg, start_chat, get_chat, get_chats, get_by_cpf, busca } from "../API/api.js";

let atual_user = {};
const conversations = {};

// Função para obter as tags selecionadas
function getSelectedTags() {
    return Array.from(document.querySelectorAll('.tags input:checked')).map(input => input.value);
}

// Função usada no botão de BUSCA, esta função busca, cria um novo chat e atualiza a lista de chats
export async function novo_chat() {
    let tags = "";
    for (const tag of getSelectedTags()) {
        tags = tags + tag + ",";
    }
    let pessoa_ideal = await busca({ tags: tags, cpf: atual_user.cpf });

    if (pessoa_ideal.status) {
        console.log(pessoa_ideal);
        return; // ninguém com essas tags 
    }

    let result = await start_chat({
        cpf1: atual_user.cpf,
        cpf2: pessoa_ideal.cpf
    });

    console.log(result);
    await update_chats(); // Atualizar a lista de chats após criar um novo chat
}

// Função para atualizar a lista de chats junto com suas mensagens
async function update_chats() {
    const chat_list = {};
    const chatids = await get_chats(atual_user);

    for (const chatid of chatids) {
        chat_list[chatid] = await get_chat({ chatid: chatid });
    }

    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = ''; // Limpar chats antigos

    for (const [chatid, chatData] of Object.entries(chat_list)) {
        const user = chatData.user; // Supondo que cada chatData tenha a propriedade `user` com o nome do usuário
        const lastMessage = chatData.messages.length > 0 ? chatData.messages[chatData.messages.length - 1].message : '';

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.dataset.user = user;

        const avatarElement = document.createElement('div');
        avatarElement.classList.add('avatar');
        const imgElement = document.createElement('img');
        imgElement.src = 'Pictures/user.png'; // Supondo que você tenha uma imagem padrão para os avatares
        imgElement.alt = `Avatar de ${user}`;
        avatarElement.appendChild(imgElement);

        const friendElement = document.createElement('div');
        friendElement.classList.add('friend');

        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.textContent = user;

        const textElement = document.createElement('div');
        textElement.classList.add('text');
        textElement.textContent = lastMessage;

        friendElement.appendChild(userElement);
        friendElement.appendChild(textElement);

        messageElement.appendChild(avatarElement);
        messageElement.appendChild(friendElement);

        // Adicionar evento de clique para abrir o chat
        messageElement.addEventListener('click', function() {
            openChat(user, messageElement);
        });

        messagesContainer.appendChild(messageElement);
    }
}

// Função para abrir o chat de um usuário
export function openChat(user, element) {
    document.querySelector('.chat-header .chat-user').textContent = user;
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = ''; // Limpar mensagens antigas

    // Destacar mensagem ativa
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => message.classList.remove('active'));
    element.classList.add('active');

    // Carregar mensagens da conversa
    conversations[user].forEach(messageData => {
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat-message', messageData.sender === 'self' ? 'self' : 'other');

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.style.backgroundImage = `url(${messageData.avatar})`;

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = messageData.message;

        newMessage.appendChild(avatar);
        newMessage.appendChild(messageContent);
        chatMessages.appendChild(newMessage);
    });

    // Rolagem automática para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Inicialização da última mensagem
export async function initializeLastMessages() {
    atual_user = getuser();
    document.getElementById("usernick").innerHTML = `${atual_user.name}`;
    await update_chats(); // Atualizar os chats na inicialização

    // Adicionar evento de clique para trocar de chat
    document.querySelectorAll('.message').forEach(message => {
        message.addEventListener('click', function() {
            openChat(this.dataset.user, this);
        });
    });
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

// Inicializar as últimas mensagens na carga da página
document.addEventListener('DOMContentLoaded', initializeLastMessages);

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