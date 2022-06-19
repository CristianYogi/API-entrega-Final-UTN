const router = require("express").Router()
const { render } = require("express/lib/response")

const isAuth = require("../middleware/isAuth")

const {postMessage, getAllMessages} = require ("./comentariosController")


router.get("/", getAllMessages)

router.post("/", isAuth ,postMessage)

module.exports = router