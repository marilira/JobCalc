// Importar o express
const express = require("express")
// Iniciar express
const server = express()
// Habilitar as rotas
const routes = require("./routes")
const path = require("path")

// Usando template engine
server.set("view engine", "ejs")

// Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

// Servir arquivos estáticos
server.use(express.static("public"))

// Usar request.body
server.use(express.urlencoded({ extended: true }))

// Usar as rotas
server.use(routes)

// Ligar o servidor(server)
server.listen(3000, () => {console.log("server ligado")})