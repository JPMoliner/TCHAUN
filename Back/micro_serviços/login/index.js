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


app.post("/login", async (request, response) => {
    let body = request.body
    let login = body.login
    let senha = body.password

    let query = `select * from users where (cpf = '${login}' or email = '${login}') and password = '${senha}'`

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

app.listen(4000, () => {
    console.log("login NA PORTA 4000")
})