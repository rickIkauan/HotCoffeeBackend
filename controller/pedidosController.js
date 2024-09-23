const Pedidos = require('../models/Pedidos')
require('dotenv').config()

// Rota para fazer pedido
exports.createPedido = async (req, res) => {
    const { user, quantidade, value, product, stats, s3url } = req.body
    try {
        const pedido = new Pedidos({
            user,
            quantidade,
            value,
            product,
            stats,
            s3url
        })

        await pedido.save()
        res.status(201).json(pedido)
    } catch (err) {
        res.status(500).json({ message: 'Não foi possivel realizar o pedido', err })
    }
}

// Rota para listar pedidos do Usuário
exports.getPedidos = async (req, res) => {
    const { user } = req.params
    try {
        const pedido = await Pedidos.find({ user })

        if (pedido.length === 0) return res.status(404).json({ message: 'Nenhum pedido encontrado para este usuário.' })


        res.status(200).json(pedido)
    } catch (err) {
        res.status(500).json({ message: 'Não foi possivel listar seus pedidos', err })
    }
}

// Rota para listar pedidos gerais
exports.getPedidosGeral = async (req, res) => {
    try {
        const pedidos = await Pedidos.find()
        if (!pedidos) return res.status(404).json({ message: 'Não há pedidos realizados' })

        res.status(200).json(pedidos)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar pedidos', err })
    }
}

// Rota para atualizar status do pedido 
exports.updateStats = async (req, res) => {
    try {
        const { pedidoId, newStatus } = req.body

        const pedido = await Pedidos.findByIdAndUpdate(
            pedidoId,
            { stats: newStatus },
            { new: true }
        )

        res.status(200).json({ message: 'Status atualizado com sucesso' })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar status', err })
    }
}