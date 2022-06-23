const router = require("express").Router()
const { render } = require("express/lib/response")

const isAuth = require("../middleware/isAuth")

const {postProductos, getAllProductos, getProductoByTitle, getProductById, getProductsByCriteria} = require ("./productosController")


router.get("/", getAllProductos)

router.post("/", isAuth ,postProductos)

router.get("/:id", getProductById)

router.get("/search", getProductsByCriteria)

router.get("/search/:title", getProductoByTitle)



module.exports = router