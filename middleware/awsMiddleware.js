const multer = require('multer')
require('dotenv').config()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 1024 }
})

module.exports = upload