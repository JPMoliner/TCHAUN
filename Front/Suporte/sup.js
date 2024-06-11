document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio do formulário

    let isValid = true;
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('shake');
            isValid = false;
            input.addEventListener('animationend', () => {
                input.classList.remove('shake');
            });
        }
    });

    if (isValid) {
        // Se o formulário for válido, envie-o
        form.submit();
    }
});