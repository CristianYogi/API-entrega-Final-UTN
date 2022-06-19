const {tokenVerify} = require("../utlis/jwt")

const isAuth = async (req, res, next) => {
    try {
        if(!req.headers.authorization){
            let error = new Error("No token provided")
            error.status = 403
            return next(error)
        }
        const token = req.headers.authorization.split(" ").pop()
        const isValidToken = await tokenVerify(token)
        if(isValidToken instanceof Error){
            let error = new Error("Token invalid")
            error.status = 403
            return next(error)
        }
        req.token = isValidToken
        
        next()

    } catch (error) {
        error.message = "Interal Server Error"
        error.status = 500
        return next(error)
    }

}

module.exports = isAuth