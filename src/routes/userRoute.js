const express = require('express')
const {userRegister,userLogin,resetPassword,deleteUserAccount,updatedUserAccount} = require('../controllers/authController.js')

const router = express.Router()

router.post('/register',userRegister)
router.post('/login',userLogin)
router.post('/reset-password',resetPassword)
router.put('/profile-uptdated',updateUserAccount)
router.delete('/delete-account',deleteUserAccount)


module.exports = router