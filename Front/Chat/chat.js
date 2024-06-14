// Armazenar mensagens em um objeto
const conversations = {
    'Yuta': [],
    'Megan': []
};

// Função para abrir o chat de um usuário
function openChat(user, element) {
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

// Função para enviar uma mensagem
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    const currentUser = document.querySelector('.chat-header .chat-user').textContent;

    if (messageText !== '') {
        const chatMessages = document.querySelector('.chat-messages');
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat-message', 'self');

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.style.backgroundImage = "url('Pictures/user.png')";

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = messageText;

        newMessage.appendChild(avatar);
        newMessage.appendChild(messageContent);
        chatMessages.appendChild(newMessage);

        // Armazenar a mensagem na conversa
        conversations[currentUser].push({
            sender: 'self',
            avatar: 'Pictures/user.png',
            message: messageText
        });

        // Atualizar última mensagem na sidebar
        updateLastMessage(currentUser, messageText);

        messageInput.value = ''; // Limpar campo de entrada
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rolagem automática para a última mensagem
    }
}

// Função para enviar mensagem com a tecla Enter
document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Função para funcionar a abertura da caixa de perfil/sair
document.querySelector('.profile').addEventListener('click', function(e) {
    e.preventDefault();
    this.parentElement.classList.toggle('active');
});

// Função para ocultar a caixa de perfil quando clicar fora dela
document.addEventListener('click', function(e) {
    if (!e.target.closest('.test-profile')) {
        document.querySelector('.test-profile').classList.remove('active');
    }
});

// Função para sair (simulada)
function logout() {
    alert('Você saiu.');
}

// Função para atualizar a última mensagem na sidebar
function updateLastMessage(user, message) {
    const userElements = document.querySelectorAll('.messages .message');
    userElements.forEach(element => {
        const username = element.querySelector('.user').textContent;
        if (username === user) {
            element.querySelector('.text').textContent = message;
        }
    });
}

// Inicialização da última mensagem
function initializeLastMessages() {
    const userElements = document.querySelectorAll('.messages .message');
    userElements.forEach(element => {
        const username = element.querySelector('.user').textContent;
        const lastMessage = conversations[username].length > 0 ? conversations[username][conversations[username].length - 1].message : 'Vamos conversar?';
        element.querySelector('.text').textContent = lastMessage;
    });
}

// Inicializar as últimas mensagens na carga da página
document.addEventListener('DOMContentLoaded', initializeLastMessages);
