const express = require('express')
const {userRegister,userLogin,resetPassword,deleteUserAccount,updateUserAccount} = require('../controllers/authController.js')

const router = express.Router()

router.post('/register',userRegister)
router.post('/login',userLogin)
router.post('/reset-password',resetPassword)
router.put('/profile-updated',updateUserAccount)
router.delete('/delete-account',deleteUserAccount)


module.exports = router