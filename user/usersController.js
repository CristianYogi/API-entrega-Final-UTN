const {send} = require("express/lib/response")
const {User} = require("./usersModel")
const nodemailer = require("nodemailer")
const data = require('../storage/infoExtra.json')

const {hashPassword, checkPassword} = require("../utlis/passwordHandler")

const {tokenSing, tokenVerify} = require("../utlis/jwt")
const Productos = require("../productos/productosModel")
const { default: mongoose } = require("mongoose")


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

// const getUserById = async (req, res, next) => {
//     try {
//         const result = await User.findById(req.params.id)

//         if (result) {
//             res.status(200).json(result)
//         } else {

//             return next()
//         }

//     } catch (error) {
//         error.status = '500'
//         error.message = 'Internal Server Error'
//         next()
//     }
// }


const getUserById = async (req, res, next) => {
    try {
        const result = await User.aggregate(
[            {$match: {_id: mongoose.mongo.ObjectId(req.token.id)}},
            {
                $lookup:
                {
                    from: "Productos",
                    localField: "_id",
                    foreignField: "userId",
                    as: "productos",
                    pipeline: [
                        {$project: {__v: 0, userId: 0, createdAt: 0, updatedAt: 0}}
                    ]
                }        
            },
            {$project: {createdAt:0, updatedAt: 0, __v: 0}}

            ]
            )
            if (result) {
                res.status(200).json({result, status : 200})
            } else {
                return next()
            }
            
        } catch (error) {
        console.log(error)
        error.status = '500'
        error.message = 'Internal Server Error'
        next(error)
    }
}

const updateUser = async (req, res, next) => { //NO LO USO
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
        password,
        img : req.body.img
    })
    
    newUser.save((error, result) => {
        if (error) {
            console.log(error)
    
            if(error.keyPattern.userName){
                error.status = 401
                error.message = "Nombre de Usuario Registrado."
                return next(error)
            }
            if(error.keyPattern.email){
                error.status = 401
                error.message = "Email ya registrado."
                return next(error)
            }
            
            error.status = 500
            error.message = "Hubo un error al registrar."
            
            next(error)
        } else {
            console.log(result)
            res.status(200).json({status:200 ,message: "Registrado Correctamente"})
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
    
    try {
        const result = await User.find({userName: req.body.userName})

        if (result.length) {
            if (await checkPassword(req.body.password, result[0].password)) {
                const user = {
                    id: result[0]._id,
                    name: result[0].nombre,
                    email: result[0].email,
                    img: result[0].img[0].link
                    
                }

                const tokenData = {
                    token: await tokenSing(user, '2h'),
                    user
                }

                res.status(200).json({Token_Info: tokenData, status: 200, message: 'Logeado Correctamente'})

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
