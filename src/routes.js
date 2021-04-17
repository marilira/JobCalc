const express = require("express")
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Mari",
        avatar: "https://github.com/marilira.png",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 4,
        "vacation-per-year": 7,
        "value-hour": 75
    },

    controllers: {
        index(request, response) {
            return response.render(views + "profile", { profile: Profile.data })
        },

        update(request, response) {
            // req.body para pegar os dados
            const data = request.body

            // definir quantas semanas tem num ano: 52
            const weeksPerYear = 52

            // remover as semanas de férias do ano para pegar quantas semanas tem 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"])/ 12

            // quantas horas por semana estou trabalhando
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
            
            // total de horas trabalhadas por mês
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            // qual será o valor da minha hora?
            const valueHour = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...request.body,
                "value-hour": valueHour
            }

            return response.redirect('/profile')
        },
    }
}

const Job = {
    data: [
        // registrando os projetos
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now()
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now()
        }
    ],
    
    controllers: {
        index(request, response) {
            const updatedJobs = Job.data.map((job) => {
                // ajustes no job
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'
            
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })

            // Entregar a resposta ao cliente
            return response.render(__dirname + "/views/index", { jobs: updatedJobs })
        },

        create(request, response) {
            return response.render(views + "job")
        },
        
        save(request, response) {
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            // cadastrando cada job/projeto
            Job.data.push({
                id: lastId + 1,
                name: request.body.name,
                "daily-hours": request.body["daily-hours"],
                "total-hours": request.body["total-hours"],
                created_at: Date.now() // Atribuindo data de hoje (milisegundos) 
            })
    
            return response.redirect('/')
        },

        show(request, response) {
            const jobId = request.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return response.send("Job not found!")
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return response.render(views + 'job-edit', { job })
        },

        update(request, response) {
            const jobId = request.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return response.send("Job not found!")
            }
            
            const updatedJob = {
                ...job,
                name: request.body.name,
                "total-hours": request.body["total-hours"],
                "daily-hours": request.body["daily-hours"],
            }

            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }

                return job
            })

            response.redirect('/job/' + jobId)
        },

        delete(request, response) {
            const jobId = request.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return response.redirect('/')
        }
    },

    services: {
        remainingDays(job) {
            // cálculo de tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
        
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
            
            const timeDiffInMs = dueDateInMs - Date.now()
            // transformar milisegundos em dias
            const dayInMs = 1000 * 3600 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            // restam x dias
            return dayDiff
        },

        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    }
}

// Criar rotas
// Buscar a home (/)
routes.get('/', Job.controllers.index)

routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)

routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.show)
routes.post('/job/delete/:id', Job.controllers.delete)

routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes;