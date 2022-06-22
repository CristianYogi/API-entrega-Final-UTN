const Productos = require("./productosModel")

const postProductos = async (req, res, next) => {
    console.log(req.body)
    const newProductos = new Productos({
        ...req.body
    })
    newProductos.save((error, result) => {
        if (error) {
            res.status = 500
            res.message = "Hubo un error al cargar el producto."
            res.send(error)
        } else {
            res.status(200).json({message: "Producto Cargado Correctamente"})
        }
    })

}

const getAllProductos = async (req, res, next) => {

    try {
        const productoData = {
            __v: 0,
            createdAt: 0,
            updatedAt: 0
        }
        const result = await Productos.find({}, productoData)

        if (result.length) {
            res.status(200).json(result)
        } else {
            next()
        }

    } catch (error) {
        error.status = '500'
        error.message = 'Internal Server Error'
        next()
    }


}

const getProductoByTitle = async (req, res, next) => {

    try {
        const productoData = {
            __v: 0,
            createdAt: 0,
            updatedAt: 0
        }
        const result = await Productos.find({title: req.params.title}, productoData)
        
        if (result.length) {
            res.status(200).json({result})
        } else {
            next()
        }

    } catch (error) {
        error.status = '500'
        error.message = 'Internal Server Error'
        next()
    }


}

module.exports = {
    postProductos,
    getAllProductos,
    getProductoByTitle
}
