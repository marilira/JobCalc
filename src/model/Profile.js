// dados de profile
let data = {
    name: "Mari",
    avatar: "https://github.com/marilira.png",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 4,
    "vacation-per-year": 7,
    "value-hour": 75
};

module.exports = {
    get() {
        return data;
    },

    update(newData) {
        data = newData;
    }
}
