const User = require('../models/User')

exports.validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/)
}
exports.validateLength = (text, min, max) => {
    if (text.length < min || text.lemgth > max) {
        return false
    }
    return true
}
exports.validateUsername = async (username) => {
    let a = false
    do {
        let check = await User.findOne({ username })
        if (check) {
            //convert a unique username
            username += (+new Date() * Math.random()).toString().substring(0, 1)
            a = true
        } else {
            a = false
        }
        //check username
    } while (a)
    return username
}