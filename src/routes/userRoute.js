const express = require('express')
const { userRegister, userLogin, resetPassword, deleteAccount, updateProfile, getProfile, getUsers, deleteUser, ConfirmResetPassword } = require('../controllers/authController.js')
const { authenticate } = require('../public/middlewares/authMiddleware.js');

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.delete('/:id', deleteUser)
router.post('/send-reset-link', resetPassword)
router.post('/reset-password', ConfirmResetPassword);
router.get('/profile', authenticate, getProfile);
router.put('/profile-updated', authenticate, (req, res, next) => {
    req.upload.single('photo')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, updateProfile);
router.delete('/delete-account', authenticate, deleteAccount);
router.get('/', getUsers)


module.exports = router