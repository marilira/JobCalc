const express = require("express")
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
    name: "Mari",
    avatar: "https://avatars.githubusercontent.com/u/69325164?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 4,
    "vacation-per-year": 7
}

// Criar rotas
// Buscar a home (/)
routes.get("/", (request, response) => {
    // Entregar a resposta ao cliente
    return response.render(__dirname + "/views/index")
})
routes.get("/job", (request, response) => response.render(views + "job"))
routes.get("/job/edit", (request, response) => response.render(views + "job-edit"))
routes.get("/profile", (request, response) => response.render(views + "profile", { profile }))

module.exports = routes;