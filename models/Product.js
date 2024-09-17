const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    s3url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product