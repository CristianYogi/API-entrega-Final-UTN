const jwt = require("jsonwebtoken")

const key = process.env.jwt_secret

//se crea el token
const tokenSing = async (userData, time) => {
    return jwt.sign(userData, key, {expiresIn: time})
}

//verificar el token
const tokenVerify = (token) => {
    try {
        return jwt.verify(token, key)
    } catch (error) {
        return error
    }
}

module.exports = {tokenSing, tokenVerify}