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

app.listen(3000, () => {
    console.log("UPDATE_TAGS NA PORTA 3000")
})