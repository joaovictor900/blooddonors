const express = require("express")
const server = express()
const cors = require('cors')

server.use(express.static('public'))

server.use(express.urlencoded({extended: true}))

server.use(cors())

// Configuração com o banco.
const {Pool,client} = require('pg')
const pool = new Pool({
    user: 'mooowlsksbrweu',
    host:'ec2-23-22-156-110.compute-1.amazonaws.com',
    database: 'd3ircpr14pj1th',
    password: '2238860cc37f1ed18109dd6b65332cc9d87d5b85ded56eca932d6d734617a88d',
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
   /* pool.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")
        const donors = result.rows

        
    })  */
    
    return res.render("index.html", {donors})
})

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios!")
    }
    
    const query = `INSERT INTO donors
        ("name", "email", "blood"alues($1, $2, $3)`

    const values =  [name, email, blood]
    pool.query(query, values, function(err){
        if(err) return res.send("Erro no baco de dados!")

        return res.redirect("/")
    })  
})
const  port = process.env.PORT || 3000
server.listen(port, function(){
    console.log("Iniciei o servidor!")
})
