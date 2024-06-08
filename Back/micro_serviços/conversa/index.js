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


app.listen(6000, () => {
    console.log("CONVERSA NA PORTA 6000")
})