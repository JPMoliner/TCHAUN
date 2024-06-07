const urlbase = 'https://0641-189-27-241-59.ngrok-free.app';



function update(user){ //update({cpf: '24324242', name: 'roger', tags: 'afro,loiro', country: 'BRAZIL', password: 'abc'})
    let data = {
        cpf: user.cpf,
        name: user.name,
        birth: user.birth,
        email: user.email,
        tags: user.tags,
        country: user.country,
        password: user.password,
    }
    fetch(urlbase+"/update", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => {
        console.error('Erro:', error); 
    });
}

function login(info){ //login({'password':'abc', 'login':'01999999919'})
    let data = {
        login: info.login,
        password: info.password,
    }
    fetch(urlbase+"/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => {
        console.error('Erro:', error); 
    });
}

function cadastro(user){ //cadastro({cpf: '24324242', name: 'roger', birth: '2000-09-17', email: 'jogindaquebrada@gmail.com', tags: 'FORTAO,GAY', country: 'BRAZIL', password: 'senha'})
    let data = {
        cpf: user.cpf,
        name: user.name,
        birth: user.birth,
        email: user.email,
        tags: user.tags,
        country: user.country,
        password: user.password,
    }
    fetch(urlbase+"/cadastro", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => {
        console.error('Erro:', error); 
    });
}

function busca(info){ // busca({'tags':'branco'})
    let data = {tags:info.tags}
    fetch(urlbase+"/busca", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => {
        console.error('Erro:', error); 
    });
}