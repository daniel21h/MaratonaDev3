const express = require('express')
const Pool = require('pg').Pool

const server = express()

// CONFIGURAR SERVIDOR PARA APRESENTAR ARQUIVOS EXTRAS(estáticos)
server.use(express.static('public'))

// HABILITAR BODY DO FORMULÁRIO
server.use(express.urlencoded({ extended: true }))

// CONEXÃO COM DB
const db = new Pool({
    user: 'postgres',
    password: 'Daniel2356',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// CONFIGURANDO TEMPLATE ENGINE
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// CONFIGURAR APRESENTAÇÃO DA PÁGINA
server.get('/', function (req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) res.send("Erro de banco de dados.")
        
        const donors = result.rows
        return res.render('index.html', { donors })
    })  
})

// PEGANDO DADOS DO FORMULÁRIO
server.post('/', function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // REGRA DE NEGÓCIO
    if (name == "" || email == "" || blood == "")
        return res.send("Todos os campos são obrigatórios")

    // COLOCANDO VALORES DENTRO DO ARRAY
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`

        const values = [name, email, blood]

    db.query(query, values, function(err) {
        // FLUXO DE ERR
        if (err) return res.send("erro no banco de dados.")

        // FLUXO IDEAL
        return res.redirect('/')
    })
})

server.listen(3000, function() {
    console.log('iniciei o servidor')
})