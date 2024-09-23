const { Upload } = require('@aws-sdk/lib-storage')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const s3 = require('../config/awsConfig')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
require('dotenv').config()

// Rota para criar usuário
exports.registerUser = async (req, res) => {
    const { email, password, firstname, secondname, admin, s3url } = req.body
    try {
        const newUser = new User({
            email,
            password,
            firstname,
            secondname,
            admin,
            s3url
        })

        await newUser.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({ message: 'Usuário não pode ser criado', err })
        console.log(err)
    }
}

// Rota para login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Email ou senha inválidos' })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        res.json({
            token,
            username: user.firstname,
            sobrenome: user.secondname,
            admin: user.admin,
            email: user.email,
            userId: user._id,
            profileImage: user.s3url
        })
    } catch (err) {
        res.status(500).json({ message: 'Ocorreu um erro', err })
    }
}

// Rota para listar usuários
exports.listUser = async (req, res) => {
    try {
        const user = await User.find()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar os usuários' })
    }
}

// Rota para excluir usuário
exports.deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

        res.status(200).json({ message: 'Usuário excluido com sucesso' })
    } catch (err) {
        res.status(500).json({ message: 'Não foi possivel excluir o usuário', err })
    }
}

// Rota para atualizar foto de perfil
exports.updateProfilePicture = async (req, res) => {
    try {
        const id = req.params.id
        const file = req.file

        if (!file) return res.status(400).json({ message: 'Arquivo não encontrado' })

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `profile/${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        }

        const command = new PutObjectCommand(params)

        const data = await s3.send(command)

        const updateUser = await User.findByIdAndUpdate(
            id, 
            { s3url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}` },
            { new: true }
        )

        res.status(200).json(updateUser)
    } catch (err) {
        res.status(500).json({ message: 'Não foi possivel atualizar a foto de perfil', err })
    }
}

// Rota para usuário mudar a senha
exports.userEdit = async (req, res) => {
    const { email } = req.params
    const { password: activePass, newPassword } = req.body

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

        const isMatch = await user.comparePassword(activePass)
        if (!isMatch) return res.status(400).json({ error: 'Senha atual incorreta' })

        if (newPassword) {
            user.password = newPassword
        }
        
        await user.save()

        res.status(200).json({ message: 'Senha atualizada com sucesso' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}