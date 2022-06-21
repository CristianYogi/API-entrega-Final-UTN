const {send} = require("express/lib/response")
const {User} = require("./usersModel")
const nodemailer = require("nodemailer")

const {hashPassword, checkPassword} = require("../utlis/passwordHandler")

const {tokenSing, tokenVerify} = require("../utlis/jwt")


const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mail_user,
      pass: process.env.mail_pass
    }
  });


// const formUsuario = (req, res, next) => {

//     res.render("registrarUsuario.ejs", {datos: ""})

// }


// TRAER TODO LOS USUARIOS
const getAllUsers = async (req, res, next) => {
    try {
        const userData = {
            __v: 0,
            // password: 0, muestro la contraseña para que se vea el hash
            createdAt: 0,
            updatedAt: 0
        }
        const result = await User.find({}, userData)

        if (result.length) {
            res.status(200).json(result)
        } else {
            next()
        }

    } catch (error) {
        error.status = 500
        error.message = 'Internal Server Error'
        next()
    }

}

const getUserById = async (req, res, next) => {
    try {
        const result = await User.findById(req.params.id)

        if (result) {
            res.status(200).json(result)
        } else {

            return next()
        }

    } catch (error) {
        error.status = '500'
        error.message = 'Internal Server Error'
        next()
    }
}


const updateUser = async (req, res, next) => {
    try {

        if(req.params.id.length != 24) return next() //LOS ID TIENEN QUE SER DE 24 CARACTERES HEXADECIMALES O LA BASE DE DATOS ME DEVUELVE UN ERROR
        
        const result = await User.findByIdAndUpdate(req.params.id, req.body)

        !result ? next() : res.status(200).json(result)
        
    } catch (error) {
        error.status = 500
        error.message = 'Internal Server Error'
        next(error)
    }
}


const registerUser = async (req, res, next) => {
    const password = await hashPassword(req.body.password)

    const newUser = new User({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        userName: req.body.userName,
        email: req.body.email,
        phoneNumber: req.body.phoeNumber,
        password
    })
    newUser.save((error, result) => {
        if (error) {
            console.log("errror", error)
            res.send(error)
        } else {
            res.status(200).json({message: "Usuario Registrado"})
        }
    })

}

const deleteUser = async (req, res, next) => {
    try {
        
        if(req.params.id.length != 24) return next()//LOS ID TIENEN QUE SER DE 24 CARACTERES HEXADECIMALES O LA BASE DE DATOS ME DEVUELVE UN ERROR

        const result = await User.deleteOne({_id: req.params.id})
        
        if(result.deletedCount){
            res.status(200).json({message: "Usuario Eliminado.", result})
        }else{
            next()
        }
        
    } catch (error) {
        error.status = 500
        error.message = "Interal Server Error"
        next(error)
    }
}

const login = async (req, res, next) => {
    console.log(req.body.userName)
    try {
        const result = await User.find({userName: req.body.userName})

        if (result.length) {
            if (await checkPassword(req.body.password, result[0].password)) {
                const user = {
                    id: result[0]._id,
                    name: result[0].nombre,
                    email: result[0].email
                }

                const tokenData = {
                    token: await tokenSing(user, '2h'),
                    user
                }

                res.status(200).json({message: `Te logeaste como ${
                        user.nombre
                    }.`, Token_Info: tokenData})

            } else {
                let error = new Error("Contraseña incorrecta")
                error.status = 401
                next(error)
            }

        } else {
            return next()
        }


    } catch (error) {
        console.log(error)
        error.status = 500
        next(error)
    }


}

const forgotPass = async(req, res, next) => {
    
    try {
        const response = await User.find({email: req.body.email})
        if(!response.length) return next() 

        const user = {
            id: response[0]._id,
            name: response[0].nombre,
            email: response[0].email
        }
        const token = await tokenSing(user, '15m')
        const link = `https://api-entrega-intermedia.herokuapp.com/users/reset/${token}` 
        
        const emailDetails = {
            from: "soporte@mydomain.com",
            to: user.email,
            subject: "Password Recovery",
            html: `
            <h2>Password Recovery Service</h2>
            <p>Click en el link para Resetear la contraseña.</p>
            <a href="${link}">-----Tremendo link-----</a>
            `
        }  
    
        transport.sendMail(emailDetails, (err, data) => {
            if(err){

                err.status = 500
                err.message = "Internal Server Error"
                return next(err)
            }
            
            res.status(200).json({message: "Email Enviado Correctamente"})
            
        })

    } catch (error) {
        
        error.status = 500
        error.message = 'Internal Server Error'
        next(next)
    }

}

const formResetPass = async (req, res, next) => {
    const {token} = req.params
    const tokenStatus = await tokenVerify(token) //Estan los datos del usuario

    if(tokenStatus instanceof Error){
        res.status(403).json({message: "Invalid Token"})
    }else{
        // res.render("formResetPass.ejs", {datos: {token}})
        res.status(200).json({message : "Aca hay un formulario xD"})
    }

    
} 

const newPass = async(req, res, next) =>{ 

    const { token } = req.params
    const tokenStatus = await tokenVerify(token) 

    if(tokenStatus instanceof Error){
        res.status(403).json({message: "Invalid Token"})
    }
    
    const password = await hashPassword(req.body.password_1)

    try {
        const result = await User.findByIdAndUpdate(tokenStatus.id,{password})
        res.status(200).json(result)
    } catch (error) {
        error.status = 500
        error.message = 'Internal Server Error'
        next(error)
    }

}

module.exports = {
    getAllUsers,
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
    login,
    forgotPass,
    formResetPass,
    newPass
}
