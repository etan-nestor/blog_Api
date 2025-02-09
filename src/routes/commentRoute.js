const express = require('express')
const { addComment, deleteComment, getComments } = require('../controllers/commentController')
const { authenticate } = require('../public/middlewares/authMiddleware.js');

const router = express.Router()


router.post('/:postId', authenticate, addComment);
router.get('/:postId', authenticate, getComments);
router.delete('/:id', authenticate, deleteComment)



module.exports = router