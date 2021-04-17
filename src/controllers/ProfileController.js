const Profile = require('../model/Profile')

module.exports = {
    index(request, response) {
        return response.render('profile', { profile: Profile.get() })
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

        Profile.update({
            ...Profile.get(),
            ...request.body,
            "value-hour": valueHour
        })

        return response.redirect('/profile')
    }
}