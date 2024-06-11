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


    let tags = tags_string.split(",")
    tags = tags.filter(tag => tag !== '');
    

    
    for (let i = 0; i < tags.length; i++) {
        if (i == 0){
            query = query + " where tags like '%"+tags[0]+"%'"
        } else {
            query = query + ` and tags like '%${tags[i]}%'`
        }
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
            }
            users.push(newuser)
        }
        response.send(users)
    })
})

app.post("/getuser", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    pool.query(`select * from users where cpf = '${cpf}'`, (err, result, colun) => {
        let user = result[0]
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