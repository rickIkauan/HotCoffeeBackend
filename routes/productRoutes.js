const express = require('express')
const productController = require('../controller/productController')
const awsMiddleware = require('../middleware/awsMiddleware')
const router = express.Router()

router.post('/upload', awsMiddleware.single('file'), productController.uploadProduct)
router.get('/list', productController.listProducts)
router.get('/search', productController.searchProducts)

module.exports = router