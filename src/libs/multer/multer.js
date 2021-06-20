const multer = require('multer')

exports.upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/tmp')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        },
    }),
})