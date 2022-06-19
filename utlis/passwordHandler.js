const bcrypt = require("bcrypt")
const saltRounds = 10

const hashPassword = async (password) =>{
    return await bcrypt.hash(password, saltRounds)
}

const checkPassword = async (pass, encryptedPass) => {
    const passwordMatch = await bcrypt.compare(pass, encryptedPass) 
    return passwordMatch
}


module.exports = {hashPassword, checkPassword}
