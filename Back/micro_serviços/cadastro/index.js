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


app.listen(2000, () => {
    console.log("CADASTRO NA PORTA 2000")
})