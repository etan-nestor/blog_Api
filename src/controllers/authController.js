const bcrypt = require('bcrypt')
const { User } = require('../models/userModel')



exports.userRegister = async (req, res) => {

    try {
        const { username, email, password } = req.body
        const hashedPassword = bcrypt.hash(password, 10)
        const user = await User.create({ username, email, password: hashedPassword })
        res.status(201).json({ message: 'Nouveau utilisateur cree avec succes', user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}


exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(404).json({ error: 'User not found' })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ error: 'Problems credentials' })
        res.status(201).json({ message: 'Login success', user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}




exports.resetPassword = async (req, res) => {
    try {
        const { email, newPssword } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(404).json({ error: 'user not found' })
        user.password = await bcrypt.hash(newPssword, 10)
        await user.save()
        res.status(200).json({ message: "Reset password successfull" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        await user.save()
        res.status(200).json({ message: 'Account delete successful' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



exports.updatedUserAccount = async (req, res) => {
    try {
        const { username, email, phoneNumber, profileImage } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.username = username || user.username;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.profileImage = profileImage || user.profileImage;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}