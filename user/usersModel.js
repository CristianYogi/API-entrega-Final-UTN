const { contentType } = require("express/lib/response")
const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phoneNumber: {type: Number},
    img: [{link : String, deleteHash: String, id: String}]
},
    {timestamps: true} //crea campos de el momento en que fue creado o actualizado
)


// UserSchema.set("toJSON", {
//     transform(doc, ret){
//         ret.id = ret._id
//         delete ret.id
//         delete ret.password
//         delete ret.__v
//     }
// })


const User = mongoose.model("User", UserSchema, "User")

module.exports = {User}