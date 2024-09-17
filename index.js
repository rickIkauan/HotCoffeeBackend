// Importar
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/dbConfig')
require('dotenv').config()

// Importando Rotas
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')

// Chamada base
const app = express()
const PORT = process.env.PORT || 3000

// Conectar banco de dados
connectDB()

// Middlewares\
app.use(cors())
app.use(express.json({ limit: '1024mb' }))
app.use(express.urlencoded({ extended: true, limit: '1024mb' }))

// Rota principal
app.get('/', (req, res) => {
    res.json({ message: 'Backend HotCoffee' })
})

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)

// Rota alternatica para erro
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Algo deu errado' })
})

// Servidor rodando local
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

module.exports = app