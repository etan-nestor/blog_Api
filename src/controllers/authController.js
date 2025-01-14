// Import de mes modules necessaires
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

// Fonctionnalite d'insciption pour un utilisateur : controller 1
exports.userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ username, email, password: hashedPassword })
        res.status(201).json({ messgae: 'Inscription Successful', user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Fonctionnalite de connexion pour un utilisateur : controller 2
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(404).json({ error: "User not found" })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ error: 'Invalid Credentials' })
        res.status(201).json({ message: 'connexion sucessful', user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//Fonctionnalites de reset password pour un utilisateur : controller 3
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(404).json({ error: 'User not found' })
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        res.status(201).json({ message: "Sucessfully reset password" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Fonctionnalite de supression de compte utilisateur
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = User.findByPk(req.user.id);
        if (!user) return res.status(404).json({error:'User not found'})
        
    } catch (error) {

    }
}

exports.updateUserAccount = async (req, res) => {
    try {

    } catch (error) {

    }
}