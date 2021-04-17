const Job = require('../model/Job')
const Profile = require('../model/Profile')
const JobUtils = require('../utils/JobUtils')

module.exports = {
    index(request, response) {
        // pegando os dados dos jobs
        const jobs = Job.get();
        // pegando os dados do profile
        const profile = Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }
    
        // total de horas por dia de cada job em progress
        let jobTotalHours = 0

        const updatedJobs = jobs.map((job) => {
            // ajustes no job
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'

            // somando a quantidade de status
            statusCount[status] += 1;

            // total de horas por dia de cada job em progress
            jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
            // if(status == 'progress') {
            //     jobTotalHours += Number(job['daily-hours'])
            // }
        
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }
        })

        // quatidade de horas que quero trabalhar por dia
        // MENOS a quantidade de hora/dia de cada job em progress
        const freeHours = profile["hours-per-day"] - jobTotalHours
    
        // Entregar a resposta ao cliente
        return response.render('index', { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
    }
}
