const express = require('express')
const pedidosController = require('../controller/pedidosController')
const router = express.Router()

router.post('/create', pedidosController.createPedido)
router.get('/list/:user', pedidosController.getPedidos)
router.get('/list', pedidosController.getPedidosGeral)
router.post('/update/status', pedidosController.updateStats)

module.exports = router