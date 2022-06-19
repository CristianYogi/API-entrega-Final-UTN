const Message = require("./comentariosModel")

const postMessage = async (req, res, next) => {

    const newMessage = new Message({
        ...req.body
    })
    newMessage.save((error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.status(200).json({message: "Se cargo correctamente"})
        }
    })

}

const getAllMessages = async (req, res, next) => {

    try {
        const messageData = {
            __v: 0,
            createdAt: 0,
            updatedAt: 0
        }
        const result = await Message.find({}, messageData)

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

module.exports = {
    postMessage,
    getAllMessages
}
