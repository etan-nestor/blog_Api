const express = require('express')
const {sharePost } = require('../controllers/shareController')
const { authenticate } = require('../public/middlewares/authMiddleware.js');

const router = express.Router()

router.post('/',authenticate,sharePost)



module.exports = router