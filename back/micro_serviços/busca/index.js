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





app.get("/busca", (request, response) => {
    let body = request.body
    let tags_string = body.tags || ""
    let query = "select * from users"


    let tags = tags_string.split(",")
    tags = tags.filter(tag => tag !== '');
    

    for (let i = 0; i < tags.length; i++) {
        query = query + " where tags like '%"+tags[i]+"%'"
        if (i != (tags.length-1)){
            query = query + " and "
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



app.listen(1000, () => {
    console.log("BUSCA NA PORTA 1000")
})