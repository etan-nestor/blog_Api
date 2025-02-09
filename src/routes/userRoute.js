const express = require('express')
const {userRegister,userLogin,resetPassword,deleteUserAccount,updateUserAccount,getUsers,deleteUser,ConfirmResetPassword } = require('../controllers/authController.js')
const { authenticate } = require('../public/middlewares/authMiddleware.js');

const router = express.Router()

router.post('/register',userRegister)
router.post('/login',userLogin)
router.delete('/:id',deleteUser)
router.post('/send-reset-link',resetPassword)
router.post('/reset-password', ConfirmResetPassword );
router.put('/profile-updated',authenticate,updateUserAccount)
router.delete('/delete-account',authenticate,deleteUserAccount)
router.get('/',getUsers)


module.exports = router