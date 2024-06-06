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





app.post("/cadastro", (request, response) => {
    let body = request.body
    let nome = body.name
    let nascimento = body.birth
    let cpf = body.cpf
    let rg = body.rg
    let tags = body.tags
    let pais = body.country
    let senha = body.password

    pool.query(`insert into users(name,birth,cpf,rg,tags,country,password) values('${nome}','${nascimento}','${cpf}','${rg}','${tags}','${pais}','${senha}');`, (err, result, colun) => {
        //console.log(result)
    })

    response.send({status:"created"})
})


app.listen(2000, () => {
    console.log("CADASTRO NA PORTA 2000")
})