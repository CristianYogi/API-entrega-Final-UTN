const {check, validationResult} = require('express-validator')

const validatorCreateUser = [
    check("name")
        .trim()
        .isAlpha('es-ES',{ignore: ' '}).withMessage("Solo letras por favor")//HAY QUE METER LA CODIFICACION
        .exists().withMessage("El campo nombre debe existir")
        .isLength({min: 2, max: 90}).withMessage("La longitud minima es de 2 caracteres"),

    check("email")
        .normalizeEmail()
        .exists().withMessage("El campo email debe de existir")
        .isEmail().withMessage("Debe de ser un email"),
    
    check("userName")
    .trim()
    .isAlpha('es-ES',{ignore: ' '}).withMessage("Solo letras por favor")
    .exists().withMessage("El campo nombre debe existir")
    .isLength({min: 2, max: 90}).withMessage("La longitud minima es de 2 caracteres"),

    check("password")
        .trim()
        .exists().withMessage("El campo password debe de existir")
        .isLength({min: 8, max: 20}).withMessage("La contraseña debe de tener entre 8 y 20 caracteres"),
    
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(404).json(errors)
        }else{
            next()
        }
    }

    ]

const validatorLoginUser = [ 
        check("userName")
        .trim()
        .isAlpha('es-ES',{ignore: ' '}).withMessage("Solo letras por favor")
        .exists().withMessage("El campo nombre debe existir")
        .isLength({min: 2, max: 90}).withMessage("La longitud minima es de 2 caracteres"),
    
        check("password")
            .trim()
            .exists().withMessage("El campo password debe de existir")
            .isLength({min: 8, max: 20}).withMessage("La contraseña debe de tener entre 8 y 20 caracteres"),
        
        (req, res, next) => {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(404).json(errors)
            }else{
                next()
            }
        }
    
        ]

const validatorResetearPass = [
    check("password_1")
        .exists()
        .isLength({min: 8, max: 15}).withMessage("entre 8 y 15")
        .trim(),
    check("password_2")
        .custom(async (password_2, {req}) => {
            if(req.body.password_1 != password_2){
                throw new Error("Ambos password tienen que ser iguales.")
            }
        }),
        (req, res, next) => {
            const {token} = req.params
            const errors = validationResult(req)
            if(!errors.isEmpty()){  
                res.status(404).json(errors)
            }else{
                return next()
            }
        }
]

module.exports = {validatorCreateUser, validatorLoginUser, validatorResetearPass}


