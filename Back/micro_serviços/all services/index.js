const express = require("express")
const cors = require("cors")
app = express()
app.use(cors())
app.use(express.json())
const mysql = require("mysql2")
require("dotenv").config()
const {db_host, db_user, db_password, db_database} = process.env
const pool = mysql.createPool({
    host: db_host,
    user: db_user,
    password : db_password,
    database: db_database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


app.post("/cadastro", async (request, response) => {
    let body = request.body
    let nome = body.name
    let nascimento = body.birth
    let cpf = body.cpf
    let email = body.email
    let tags = body.tags
    let pais = body.country
    let senha = body.password

    let jatem = await new Promise((resolve, reject) => {pool.query(`select * from users where cpf = '${cpf}' or email = '${email}'`, (err, results, fields) => {
        resolve(results[0])
    })})

    if (jatem){
        if (jatem.cpf == cpf && jatem.email == email){
            response.send({status:"already have someone with this cpf and email"})
        } else if (jatem.cpf == cpf) {
            response.send({status:"already have someone with this cpf"})
        } else {
            response.send({status:"already have someone with this email"})
        }
        return
    }

    let query = `insert into users(name,birth,cpf,email,tags,country,password) values('${nome}','${nascimento}','${cpf}','${email}','${tags}','${pais}','${senha}');`

    console.log(query)

    pool.query(query, (err, result, colun) => {
        //console.log(result)
    })

    response.send({status:"created"})
})

app.post("/busca", (request, response) => {
    let body = request.body
    let tags_string = body.tags || ""
    let query = "select * from users"


    let tags = tags_string.split(",")
    tags = tags.filter(tag => tag !== '');
    

    
    for (let i = 0; i < tags.length; i++) {
        if (i == 0){
            query = query + " where tags like '%"+tags[0]+"%'"
        } else {
            query = query + ` and tags like '%${tags[i]}%'`
        }
    }

    let users = []

    console.log(query)

    pool.query(query, (err, result, colun) => {
        for (user of result){
            let newuser = {
                name: user.name,
                country: user.country,
                birth: user.birth,
                tags: user.tags,
                email: user.email
            }
            users.push(newuser)
        }
        response.send(users)
    })
})

app.post("/getuser", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    pool.query(`select * from users where cpf = '${cpf}'`, (err, result, colun) => {
        response.send(result[0])
    })
})

app.post("/login", (request, response) => {
    let body = request.body
    let login = body.login
    let senha = body.password

    let query = `select * from users where (cpf = '${login}' or email = '${login}') and password = '${senha}'`

    console.log(query)

    pool.query(query, (err, result, colun) => {
        response.send(result[0])
    })
})

app.post("/update", (request, response) => {
    let query = "update users set "
    let body = request.body
    let cpf = body.cpf
    let tags = body.tags
    let name = body.name
    let email = body.email
    let birth = body.birth
    let country = body.country
    let password = body.password

    if (name){
        query = query + `name = '${name}',`
    }
    if (tags){
        query = query + `tags = '${tags}',`
    }
    if (email){
        query = query + `email = '${email}',`
    }
    if (birth){
        query = query + `birth = '${birth}',`
    }
    if (country){
        query = query + `country = '${country}',`
    }
    if (password){
        query = query + `password = '${password}',`
    }

    if (query == "update users set "){
        response.send({status:"ignored"})
        return
    } else {
        query = query.slice(0, -1)
        query = query + ` where cpf = '${cpf}'`
    }

    console.log(query)

    pool.query(query, (err, result, colun) => {

    })

    response.send({status:"updated"})
})


let chats = {}
let cpf_to_chat = {}
app.post("/start_chat", (request, response) => {
    let body = request.body
    let cpf1 = body.cpf1
    let cpf2 = body.cpf2

    if (cpf_to_chat[cpf1]){
        response.send({status:"cpf already is in a chat", cpf:cpf1})
        return
    }
    if (cpf_to_chat[cpf2]){
        response.send({status:"cpf already is in a chat", cpf:cpf2})
        return
    }

    let chatid = ""+cpf1+cpf2

    cpf_to_chat[cpf1] = chatid
    cpf_to_chat[cpf2] = chatid

    chats[chatid] = {
        id: chatid,
        users: {
            cpf1: cpf1,
            cpf2: cpf2
        },
        msgs: []
    }

    response.send({chatid:chatid})
})
app.post("/send_msg", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    let msg = body.msg

    let chatid = cpf_to_chat[cpf]
    if (!chatid){
        response.send({status:"This cpf are not in a chat"})
        return
    }
    let chat = chats[chatid]

    chat.msgs.push({msg:msg,cpf:cpf})

    response.send({status:"Mensagem enviada"})
})
app.post("/del_chat", (request, response) => {
    let body = request.body
    let chatid = body.chatid

    let chat = chats[chatid]

    if (!chat){
        response.send({status:"This chat does not exist"})
        return
    }

    delete cpf_to_chat[chat.users.cpf1]
    delete cpf_to_chat[chat.users.cpf2]

    delete chats[chatid]

    response.send({status:"Chat Deleted"})
})
app.post("/get_chat", (request, response) => {
    let body = request.body
    let chatid = body.chatid
    let cpf = body.cpf

    if (chatid){
        response.send(chats[chatid])
        return
    }
    if (cpf){
        if (cpf_to_chat[cpf]){
            response.send(chats[cpf_to_chat[cpf]])
        } else {
            response.send({})
        }
        return
    }

    response.send({status:"Invalid use"})
})


app.listen(5000, () => {
    console.log("ALL SERVICES NA PORTA 5000")
})