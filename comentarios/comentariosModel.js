const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ComentariosSchema = new Schema({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    body: {type: String, required: true, unique: false},
},
    {timestamps: true} //crea campos de el momento en que fue creado o actualizado
)



const Comentarios = mongoose.model("Comentarios", ComentariosSchema, "Comentarios")

module.exports = Comentarios


