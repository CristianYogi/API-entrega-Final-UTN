require("dotenv").config()
require("./db/config")

const cors = require('cors');

const express = require("express")

const server = express()
const path = require('path')

const port = process.env.PORT || 8000




server.use(express.static('public'))

//VIEW ENGINE
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs');


server.use(express.json())
server.use(express.urlencoded({extended: true})) 

server.use(cors({
    // origin: 'https://front-entrega-final.herokuapp.com',
    origin: '*',
    credentials: true
    // origin:'*'
}));

server.use((req, res, next) => {
    req.headers['Access-Control-Allow-Origin'] = "*"
    console.log("entra")
    console.log(req.body)
    next()
})
//PRIMER RESPUESTA
server.get("/", (req, res) => {
    res.status(200).json({message : "funca"})
})

//USERS
server.use("/users", require("./user/usersRouter"))

server.use("/productos", require("./productos/productosRouter"))

server.use("/comentarios", require("./comentarios/comentariosRouter"))


server.use((req, res, next) => {
    let error = new Error()
    error.status = 404
    error.message = "Resourse Not Found"
    next(error)
})

server.use((error ,req, res, next) => {

    res.status(error.status).json({status: error.status, message : error.message})

})


server.listen(port, (err) => {
    err ? console.log(`Error: ${err}`) : console.log(`App corre en http://localhost:${port}`)
})

