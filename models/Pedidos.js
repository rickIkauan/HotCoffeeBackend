const mongoose = require('mongoose')

const PedidosSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    quantidade: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    stats: {
        type: String,
        required: true,
        default: 'Não iniciado'
    },
    s3url: {
        type: String,
        required: true
    }
})

PedidosSchema.pre('save', function (next) {
    const dataAtual = new Date()
    this.date = dataAtual.toLocaleDateString('pt-BR')
    next()
})

const Pedidos = mongoose.model('Pedidos', PedidosSchema)

module.exports = Pedidos