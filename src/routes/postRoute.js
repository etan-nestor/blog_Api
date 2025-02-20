const express = require('express')
const { createPost, updatePost, getPostDetail, getRecentsPosts, getLikedPosts, getSharedPosts, getCommentedPosts, deletePost, getAllPosts, getPopularPosts, getArchivedPosts } = require('../controllers/postController')
const { authenticate } = require('../public/middlewares/authMiddleware.js');

const router = express.Router()


router.get('/', authenticate, getAllPosts)
router.get('/recents', authenticate, getRecentsPosts);
router.get('/popular', authenticate, getPopularPosts);
router.get('/archive', authenticate, getArchivedPosts);
router.get('/post/:id', authenticate, getPostDetail);

router.post('/add-post', (req, res, next) => {
    req.upload.single('image')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, createPost);

router.get('/liked', authenticate, getLikedPosts);
router.get('/commented', authenticate, getCommentedPosts);
router.get('/shared', authenticate, getSharedPosts);

router.put('/:id', authenticate, updatePost)
router.delete('/:id', authenticate, deletePost)

module.exports = router