const urlbase = 'https://7713-189-27-242-227.ngrok-free.app';


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

export async function update(user){ // update({cpf: '24324242', name: 'roger', tags: 'afro,loiro', nickname: 'PEDRIN', password: 'abc'})
    return await post(urlbase+"/update", user)
}

export async function login(info){ // login({'password':'abc', 'login':'24324242'})
    return await post(urlbase+"/login", info)
}

export async function cadastro(user){ // cadastro({cpf: '24324242', name: 'roger', birth: '2000-09-17', email: 'jogindaquebrada@gmail.com', tags: 'FORTAO,GAY', nickname: 'ROGER', password: 'senha', gender:'HELICOPTERO'})
    return await post(urlbase+"/cadastro", user)
}

export async function busca(info){ // busca({'tags':''})
    return await post(urlbase+"/busca", info)
}

export async function get_by_cpf(info){
    return await post(urlbase+"/getuser", info)
}


export async function start_chat(info){ // start_chat({cpf1:'23232',cpf2:'424242424'})
    return await post(urlbase+"/start_chat", info)
}

export  async function send_msg(info){ // send_msg({chatid:'23232424242424',msg:'ADORO ESSE SITE :D',cpf:'424242424'})
    return await post(urlbase+"/send_msg", info)
}

export async function del_chat(info){ // del_chat({chatid:'23232424242424'})
    return await post(urlbase+"/del_chat", info)
}

export async function get_chat(info){ // get_chat({chatid:'23232424242424'})
    return await post(urlbase+"/get_chat", info)
}

export async function get_chats(info){ // get_chats({cpf:'424242424'})
   return await post(urlbase+"/get_chats", info)
}

export function updateuser(newuser){
    const jsonString = JSON.stringify(newuser);
    localStorage.setItem('user', jsonString);
}

export function getuser(){
    const jsonRecuperado = localStorage.getItem('user');
    const objetoRecuperado = JSON.parse(jsonRecuperado);
    return objetoRecuperado
}
