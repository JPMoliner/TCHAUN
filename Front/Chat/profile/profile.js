document.getElementById('profilePicture').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePreview = document.getElementById('profilePreview');
            profilePreview.src = e.target.result;
            
            // Atualizar imagem de perfil no chat
            const chatAvatar = document.querySelector('.header .avatar img');
            chatAvatar.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('accountSettingsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Form Data:', data);
    alert('Alterações salvas!');
});

document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function() {
        tag.classList.toggle('selected');
    });
});