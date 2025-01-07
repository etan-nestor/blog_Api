const express = require('express')
const {addComment,deleteComment,updateComment} = require('../controllers/commentController')

const router = express.Router()


router.post('/',addComment)
router.put('/:id',updateComment)
router.delete('/:id',deleteComment)


module.exports = router