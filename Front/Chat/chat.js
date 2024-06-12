document.querySelector('.profile').addEventListener('click', function(e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')

})

/*   funcao pra clicar em qualquer lugar e sumir a caixinha do perfil, porem nao funcionou.
document.addEventListener('click', function(e) {
    if(le.target.matches('.test-profile, .test-profile *')) {
        document.querySelector('.test-profile').classList.remove('active')
    }
}) */
