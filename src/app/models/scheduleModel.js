const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schedules=new Schema({
    accountuser: String,
    username: String,
    doctorname: String,
    for: String,
    email: String,
    phone: String,
    birthday: String,
    timeday: String,
    timehours: String,
    address: String,
    description: String,
}, {
    timestamps: true,
})

module.exports = mongoose.model('schedules', schedules)