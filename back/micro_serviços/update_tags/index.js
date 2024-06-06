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
    let rg = body.rg
    let tags = body.tags
    let pais = body.country
    let senha = body.password

    let jatem = await new Promise((resolve, reject) => {pool.query(`select * from users where cpf = ${cpf}`, (err, results, fields) => {
        resolve(results)
    })})

    if (jatem){
        response.send({status:"already have someone with this cpf"})
        return
    }

    pool.query(`insert into users(name,birth,cpf,rg,tags,country,password) values('${nome}','${nascimento}','${cpf}','${rg}','${tags}','${pais}','${senha}');`, (err, result, colun) => {
        //console.log(result)
    })

    response.send({status:"created"})
})

app.get("/busca", (request, response) => {
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

    pool.query(query, (err, result, colun) => {
        for (user of result){
            let newuser = {
                name: user.name,
                country: user.country,
                birth: user.birth,
                tags: user.tags
            }
            users.push(newuser)
        }
        response.send(users)
    })
})

app.post("/login", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    let senha = body.password

    pool.query(`select * from users where cpf = ${cpf} and password = '${senha}'`, (err, result, colun) => {
        response.send(result)
    })
})

app.post("/update", (request, response) => {
    let body = request.body
    let cpf = body.cpf
    let tags = body.tags

    pool.query(`update users set tags = '${tags}' where cpf = ${cpf}`, (err, result, colun) => {
        console.log(result)
    })

    response.send({status:"updated"})
})


app.listen(3000, () => {
    console.log("UPDATE_TAGS NA PORTA 3000")
})