var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log("entra?")
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
 let upload = multer({ storage: storage });

 module.exports = upload