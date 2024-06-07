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





app.post("/login", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    let senha = body.password
    let email = body.email

    pool.query(`select * from users where (cpf = '${cpf}' or email = '${email}') and password = '${senha}'`, (err, result, colun) => {
        response.send(result)
    })
})

app.listen(4000, () => {
    console.log("login NA PORTA 4000")
})