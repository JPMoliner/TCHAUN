const express = require("express")
app = express()
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


let chats = {}
let cpf_to_chats = {}
app.post("/start_chat", (request, response) => {
    let body = request.body
    let cpf1 = body.cpf1
    let cpf2 = body.cpf2
    

    let chatid = ""+cpf1+cpf2

    if (chats[chatid]){
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



app.listen(6000, () => {
    console.log("CONVERSA NA PORTA 6000")
})