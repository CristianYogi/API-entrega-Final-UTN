const router = require("express").Router()
const { render } = require("express/lib/response")

const isAuth = require("../middleware/isAuth")

const {deleteProduct ,postProductos, getAllProductos, getProductoByTitle, getProductById, getProductsByCriteria, updateProduct} = require ("./productosController")


router.get("/", getAllProductos)

router.post("/", isAuth ,postProductos)

router.get("/:id", getProductById)

router.get("/search/:min/:max/:categoria", getProductsByCriteria)

router.get("/search/:title", getProductoByTitle)

router.delete("/:id", isAuth, deleteProduct)

router.put("modificar/:id", isAuth, updateProduct)



module.exports = router