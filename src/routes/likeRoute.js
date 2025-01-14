const express = require('express')
const {likePost,unlikePost} = require('../controllers/likeController')

const router = express.Router()

router.post('/',likePost)
router.delete('/:id',unlikePost)


module.exports = router