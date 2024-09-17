const Product = require('../models/Product')
const s3 = require('../config/awsConfig')
const { Upload } = require('@aws-sdk/lib-storage')
require('dotenv').config()

// Rota para criar produto
exports.uploadProduct = async (req, res) => {
    try {
        const { name, description, value, category } = req.body
        const file = req.file

        if (!file) return res.status(400).json({ message: 'Arquivo não encontrado' })

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `product/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }

        const upload = new Upload({
            client: s3,
            params: params,
            queueSize: 4,
            partSize: 1024 * 1024 * 1024,
            leavePartsOnError: false
        })

        const data = await upload.done()

        const newProduct = new Product({
            name,
            description,
            value,
            category,
            s3url: data.Location
        })

        await newProduct.save()
        res.status(201).json(newProduct)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar produto', err })
    }
}