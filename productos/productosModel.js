const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ProductosSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true, unique: false},
    categoria: {type: String, required: true},
    precio : {type: Number, require: true},
    img: [{link : String, deleteHash: String, id: String}],
    caracteristica: {type: String}
},
    {timestamps: true} //crea campos de el momento en que fue creado o actualizado
)



const Productos = mongoose.model("Productos", ProductosSchema, "Productos")

module.exports = Productos


