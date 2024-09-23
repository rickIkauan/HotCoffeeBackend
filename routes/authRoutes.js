const express = require('express')
const authController = require('../controller/authController')
const awsMiddleware = require('../middleware/awsMiddleware')
const router = express.Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/list', authController.listUser)
router.delete('/delete/:id', authController.deleteUser)
router.post('/uploadProfile/:id', awsMiddleware.single('file'), authController.updateProfilePicture)
router.put('/edituser/:email', authController.userEdit) // Rota para usuário mudar sua senha

module.exports = router