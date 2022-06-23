const router = require("express").Router()
const { render } = require("express/lib/response")
const { validatorCreateUser , validatorLoginUser, validatorResetearPass} = require("../validator/formsValidator")
const { getAllUsers, registerUser , getUserById, updateUser, deleteUser, login, forgotPass, formResetPass, newPass} = require("./usersController")
const isAuth = require("../middleware/isAuth")
// const {uploadFilesMiddleware} = require("../utlis/handleStorage")


//OBTENER USUARIO
router.get("/", getAllUsers)

router.post("/register" ,  validatorCreateUser, registerUser)

router.get("/login", (req, res) => {
    res.render("login.ejs", {datos : ""})
})

router.post("/login", validatorLoginUser, login)


router.get("/:id", isAuth, getUserById)


router.put("/:id", updateUser)


router.delete("/:id", deleteUser)

// router.get("/pass-form", (req, res) => {
//     res.render("recuperarPass.ejs", {datos: ""})
// })

router.post("/forgot-pass", forgotPass)

router.get("/reset/:token", formResetPass)

router.post("/new-pass/:token", validatorResetearPass, newPass)


module.exports = router

