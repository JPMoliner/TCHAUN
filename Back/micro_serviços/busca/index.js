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


app.listen(1000, () => {
    console.log("BUSCA NA PORTA 1000")
})