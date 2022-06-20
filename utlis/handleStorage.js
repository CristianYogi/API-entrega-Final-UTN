const storage = new GridFsStorage({ url: process.env.MONGODB_URI, file: (req, file) => { return new Promise((resolve, reject) => { crypto.randomBytes(16, (err, buf) => { if (err) { return reject(err); } const filename = file.originalname; const fileInfo = { filename: filename, bucketName: "uploads" }; resolve(fileInfo); }); }); } });
const fileUpload = multer({storage})

module.exports = fileUpload