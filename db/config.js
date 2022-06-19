
const mongoose = require("mongoose")

const uri = process.env.MONGODB_URI

const options = {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(uri, options, (err) => {
        err ? console.log("atlas no se conecto") : console.log("atlas conectado")
})


