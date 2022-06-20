const multer = require("multer");

const storage = multer.diskStorage({
    destination:(req, file, callback) => {
        const pathStorage = `${__dirname}/../img_storage`
        console.log('FILE',file)
        callback(null, pathStorage)
    },
    filename:(req, file, callback) => {
        const ext = file.originalname.split(".").pop()
        const filename = `img-${Date.now()}.${ext}`
        console.log(filename)
        callback(null, filename)
    }
})

const fileUpload = multer({storage})

module.exports = fileUpload