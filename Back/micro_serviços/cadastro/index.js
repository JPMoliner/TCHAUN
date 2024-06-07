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
    let pais = body.country
    let senha = body.password

    let jatem = await new Promise((resolve, reject) => {pool.query(`select * from users where cpf = ${cpf} or email = ${email}`, (err, results, fields) => {
        resolve(results)
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

    pool.query(`insert into users(name,birth,cpf,email,tags,country,password) values('${nome}','${nascimento}','${cpf}','${email}','${tags}','${pais}','${senha}');`, (err, result, colun) => {
        //console.log(result)
    })

    response.send({status:"created"})
})


app.listen(2000, () => {
    console.log("CADASTRO NA PORTA 2000")
})