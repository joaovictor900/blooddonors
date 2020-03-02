const express = require("express")
const server = express()
const cors = require('cors')

server.use(express.static('public'))

server.use(express.urlencoded({extended: true}))

server.use(cors())

// Configuração com o banco.
const {Pool,client} = require('pg')
const pool = new Pool({
    user: 'postgres',
    host:'localhost',
    database: 'doe',
    password: '123456',
    port: 5432
})
 

pool.connect(function(err){
    if(err) return console.log(err);
    console.log('conectou!');
  })

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache:true
})

//configurar a apresentação da página
server.get("/", function(req, res){
    pool.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")
        const donors = result.rows

        return res.render("index.html", {donors})
    })   
})

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios!")
    }
    
    const query = `INSERT INTO donors
        ("name", "email", "blood")values($1, $2, $3)`

    const values =  [name, email, blood]
    pool.query(query, values, function(err){
        if(err) return res.send("Erro no baco de dados!")

        return res.redirect("/")
    })  
})

server.listen(3000, function(){
    console.log("Iniciei o servidor!")
})
