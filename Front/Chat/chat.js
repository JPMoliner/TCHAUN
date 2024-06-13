// Função para abrir o chat de um usuário
function openChat(user) {
    document.querySelector('.chat-header .chat-user').textContent = user;
    document.querySelector('.chat-messages').innerHTML = ''; // Limpar mensagens antigas
}

// Função para enviar uma mensagem
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

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

        messageInput.value = ''; // Limpar campo de entrada
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rolagem automática para a última mensagem
    }
}

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