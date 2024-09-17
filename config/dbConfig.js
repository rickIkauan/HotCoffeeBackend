const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log('MongoDB conectado')
    } catch (err) {
        console.error('Erro ao conectado o MongoDB', err)
        process.exit(1)
    }
}

module.exports = connectDB