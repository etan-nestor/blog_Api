const express = require('express')
const { likePost, unlikePost } = require('../controllers/likeController')
const { authenticate } = require('../public/middlewares/authMiddleware.js');

const router = express.Router()

router.post('/',authenticate, likePost)
router.delete('/:postId',authenticate, unlikePost)


module.exports = router