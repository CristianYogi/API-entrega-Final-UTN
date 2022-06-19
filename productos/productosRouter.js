const router = require("express").Router()
const { render } = require("express/lib/response")

const isAuth = require("../middleware/isAuth")

const {postProductos, getAllProductos, getProductoByTitle} = require ("./productosController")


router.get("/", getAllProductos)

router.post("/", isAuth ,postProductos)

router.get("/:title", getProductoByTitle)


module.exports = router