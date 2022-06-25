const Productos = require("./productosModel")
const mongoose = require('mongoose');


const deleteProduct = async (req, res, next) => {
    try {
        
        if(req.params.id.length != 24) return next()

        const result = await Productos.deleteOne({_id: req.params.id})
        
        if(result.deletedCount){
            res.status(200).json({message: "Producto Eliminado", status: 200, result})
        }else{
            next()
        }
        
    } catch (error) {
        error.status = 500
        error.message = "Interal Server Error"
        next(error)
    }
}

const postProductos = async (req, res, next) => {
    const newProductos = new Productos({
        ...req.body,
        userId: new mongoose.mongo.ObjectId(req.body.userId)
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


const getProductById = async (req, res, next) => {
    try {
        const result = await Productos.findById(req.params.id)

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

const getProductsByCriteria = async(req, res, next) => {
    const data = {
        categoria: req.params.categoria != 'Todo' ? req.params.categoria : "",
        min: req.params.min || 0,
        max: req.params.max || 50000
    }
    
    try {   
        const productoData = {
            __v: 0,
            createdAt: 0,
            updatedAt: 0
        }
        const result = await Productos.find({categoria: {$regex: data.categoria}, precio : {$gte:data.min, $lte:data.max}}, productoData)

        if (result.length) {
            res.status(200).json({result, status: 200})
        } else {
            next()
        }

    } catch (error) {
        error.status = '500'
        error.message = 'Internal Server Error'
        next()
    }

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
            res.status(200).json({result, status: 200})
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
        const result = await Productos.find({title: {$regex : req.params.title}}, productoData)
        
        if (result.length) {
            res.status(200).json({result, status: 200})
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
    getProductoByTitle,
    getProductById,
    getProductsByCriteria,
    deleteProduct
}
