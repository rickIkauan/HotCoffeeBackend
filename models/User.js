const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    secondname: {
        type: String,
        required: true
    },
    s3url: {
        type: String,
        required: true,
        default: 'https://coffehot.s3.us-east-2.amazonaws.com/userIcon.jpg'
    },
    admin: {
        type: String,
        required: true,
        default: 'Não'
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            next()
        } catch (err) {
            next (err)
        }
})

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User