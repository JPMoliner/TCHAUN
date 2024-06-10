const urlbase = 'https://d8e3-189-27-241-59.ngrok-free.app';



async function post(url, data){
    let resposta
    await fetch(url, {
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
        resposta = data
        return data
    })
    return resposta
}

async function update(user){ //update({cpf: '24324242', name: 'roger', tags: 'afro,loiro', nickname: 'PEDRIN', password: 'abc'})
    console.log(await post(urlbase+"/update", user))
}

async function login(info){ //login({'password':'senha', 'login':'24324242'})
    console.log(await post(urlbase+"/login", info))
}

async function cadastro(user){ //cadastro({cpf: '24324242', name: 'roger', birth: '2000-09-17', email: 'jogindaquebrada@gmail.com', tags: 'FORTAO,GAY', nickname: 'ROGER', password: 'senha', gender:'HELICOPTERO'})
    console.log(await post(urlbase+"/cadastro", user))
}

async function busca(info){ // busca({'tags':'branco'})
    console.log(await post(urlbase+"/busca", info))
}


async function start_chat(info){ // start_chat({cpf1:'23232',cpf2:'424242424'})
    console.log(await post(urlbase+"/start_chat", info))
}

async function send_msg(info){ // send_msg({cpf:'23232',msg:'ADORO ESSE SITE :D'})
    console.log(await post(urlbase+"/send_msg", info))
}

async function del_chat(info){ // del_chat({chatid:'23232424242424'})
    console.log(await post(urlbase+"/del_chat", info))
}

async function get_chat(info){ // get_chat({cpf:'424242424'}) or get_chat({chatid:'23232424242424'})
    console.log(await post(urlbase+"/get_chat", info))
}

