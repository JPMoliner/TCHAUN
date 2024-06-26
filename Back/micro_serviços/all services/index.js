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
    let nickname = body.nickname
    let senha = body.password
    let genero = body.gender

    console.log("CADASTRO")

    if ((nome == undefined || nascimento == undefined || cpf == undefined || email == undefined || tags == undefined || nickname == undefined || senha == undefined || genero == undefined)){
        response.send({status:"invalid use"})
        return
    }



    let jatem = await new Promise((resolve, reject) => {pool.query(`select * from users where cpf = '${cpf}' or email = '${email}' or nickname = '${nickname}'`, (err, results, fields) => {
        resolve(results[0])
    })})

    if (jatem){
        response.send({
            cpf: cpf == jatem.cpf,
            email: email == jatem.email,
            nickname: nickname == jatem.nickname
        })
        return
    }

    let query = `insert into users(name,birth,cpf,email,tags,nickname,password,gender) values('${nome}','${nascimento}','${cpf}','${email}','${tags}','${nickname}','${senha}','${genero}');`

    console.log(query)

    pool.query(query, (err, result, colun) => {
        console.log(err)
    })

    response.send({status:"created"})
})

app.post("/busca", (request, response) => {
    let body = request.body
    let tags_string = body.tags || ""
    let query = "select * from users"
    let cpf = body.cpf

    if (cpf == undefined){
        response.send({"status":"invalid use"})
        return
    }

    let tags = tags_string.split(",")
    tags = tags.filter(tag => tag !== '');
    

    query = query + ` where cpf != '${cpf}'`
    for (let i = 0; i < tags.length; i++) {
        query = query + ` and tags like '%${tags[i]}%'`
    }


    let users = []

    console.log(query)

    pool.query(query, (err, result, colun) => {
        for (user of result){
            let newuser = {
                nickname: user.nickname,
                birth: user.birth,
                tags: user.tags,
                email: user.email,
                gender: user.gender,
                cpf: user.cpf
            }
            users.push(newuser)
        } 
        if (users.length == 0){
            response.send({status:"ninguem foi encontrado"})
        } else {
            const randomIndex = Math.floor(Math.random() * users.length);
            response.send(users[randomIndex])
        }
    })
})

app.post("/getuser", (request, response) => {
    let body = request.body
    let cpf = body.cpf

    console.log(`select * from users where cpf = '${cpf}'`)

    pool.query(`select * from users where cpf = '${cpf}'`, (err, result, colun) => {
        let user = result[0]
        if (!user){
            response.send({status:"invalid user"})
            return
        }
        response.send ({
            nickname: user.nickname,
            birth: user.birth,
            tags: user.tags,
            email: user.email,
            gender: user.gender,
        })
    })
})

app.post("/login", async (request, response) => {
    let body = request.body
    let login = body.login
    let senha = body.password

    console.log("LOGIN")

    let query = `select * from users where (cpf = '${login}' or email = '${login}' or nickname = '${login}') and password = '${senha}'`

    console.log(query)

    let logou = false
    await new Promise((resolve, reject) => {pool.query(query, (err, result, fields) => {
        if (result[0]) {
            response.send(result[0])
            logou = true
        }
        resolve(true)
    })})
    if (!logou) {
        response.send({status:"invalid password or login"})
    }
})

app.post("/update", (request, response) => {
    let query = "update users set "
    let body = request.body
    let cpf = body.cpf
    let tags = body.tags
    let name = body.name
    let email = body.email
    let birth = body.birth
    let password = body.password
    let genero = body.gender
    let nickname = body.nickname

    if (nickname){
        query = query + `gender = '${nickname}',` 
    }
    if (genero){
        query = query + `gender = '${genero}',` 
    }
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
let cpf_to_chats = {}
app.post("/start_chat", (request, response) => {
    let body = request.body
    let cpf1 = body.cpf1
    let cpf2 = body.cpf2
    
    if (cpf1 == undefined || cpf2 == undefined){
        response.send("invalid use")
        return
    }

    let chatid = ""+cpf1+cpf2
    let chatid2 = ""+cpf2+cpf1

    if (chats[chatid] || chats[chatid2]){
        response.send({status:"These people are already in a chat"})
        return
    }

    cpf_to_chats[cpf1] = cpf_to_chats[cpf1] || {}
    cpf_to_chats[cpf2] = cpf_to_chats[cpf2] || {}


    chats[chatid] = {
        id: chatid,
        users: {
            cpf1: cpf1,
            cpf2: cpf2
        },
        msgs: []
    }

    cpf_to_chats[cpf1][chatid] = chatid
    cpf_to_chats[cpf2][chatid] = chatid

    response.send({chatid:chatid})
})
app.post("/send_msg", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    let msg = body.msg
    let chatid = body.chatid

    if (!chatid || !chats[chatid]){
        response.send({status:"invalid chat id"})
        return
    }
    if (!cpf_to_chats[cpf] || !cpf_to_chats[cpf][chatid]){
        response.send({status:"User is not in this chat"})
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

    delete cpf_to_chats[chat.users.cpf1][chatid]
    delete cpf_to_chats[chat.users.cpf2][chatid]

    delete chats[chatid]

    response.send({status:"Chat Deleted"})
})
app.post("/get_chat", (request, response) => {
    let body = request.body
    let chatid = body.chatid
    if (chatid){
        response.send(chats[chatid] || {})
        return
    }
    response.send({status:"Invalid use"})
})
app.post("/get_chats", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    if (cpf){
        console.log(cpf_to_chats[cpf] || {})
        response.send((cpf_to_chats[cpf] || {}))
        return
    }
    response.send({status:"Invalid use"})
})

app.listen(5000, () => {
    console.log("ALL SERVICES NA PORTA 5000")
})