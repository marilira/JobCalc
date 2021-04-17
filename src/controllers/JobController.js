const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    create(request, response) {
        return response.render('job')
    },
    
    save(request, response) {
        const jobs = Job.get()

        const lastId = jobs[jobs.length - 1]?.id || 0;

        // cadastrando cada job/projeto
        jobs.push({
            id: lastId + 1,
            name: request.body.name,
            "daily-hours": request.body["daily-hours"],
            "total-hours": request.body["total-hours"],
            created_at: Date.now() // Atribuindo data de hoje (milisegundos) 
        })

        return response.redirect('/')
    },

    show(request, response) {
        const jobs = Job.get()
        const profile = Profile.get()

        const jobId = request.params.id

        const job = jobs.find(job => Number(job.id) === Number(jobId))

        if (!job) {
            return response.send("Job not found!")
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

        return response.render('job-edit', { job })
    },

    update(request, response) {
        const jobId = request.params.id

        const jobs = Job.get()
        const job = jobs.find(job => Number(job.id) === Number(jobId))

        if (!job) {
            return response.send("Job not found!")
        }
        
        const updatedJob = {
            ...job,
            name: request.body.name,
            "total-hours": request.body["total-hours"],
            "daily-hours": request.body["daily-hours"],
        }

        const newJobs = jobs.map(job => {
            if(Number(job.id) === Number(jobId)) {
                job = updatedJob
            }

            return job
        })

        Job.update(newJobs)

        response.redirect('/job/' + jobId)
    },

    delete(request, response) {
        const jobId = request.params.id

        Job.delete(jobId)

        return response.redirect('/')
    }
}