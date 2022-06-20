require("dotenv").config()
require("./db/config")
const cors = require('cors');

const express = require("express")

const server = express()
const path = require('path')

const port = process.env.PORT || 8000
server.use(cors({origin: true}));

const corsOptions = {
    origin: 'https://front-entrega-final.herokuapp.com',
    optionsSuccessStatus: 200 
  }

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

server.use(express.static('public'))

//VIEW ENGINE
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs');


server.use(express.json())
server.use(express.urlencoded({extended: true})) 

//PRIMER RESPUESTA
server.get("/", (req, res) => {
    res.status(200).json({message : "funca"})
})

//USERS
server.use("/users", cors(corsOptions), require("./user/usersRouter"))

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

