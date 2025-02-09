const express = require('express')
const userRoutes = require('./userRoute');
const postRoutes = require('./postRoute');
const shareRoutes = require('./shareRoute');
const likeRoutes = require('./likeRoute')
const commentRoutes= require('./commentRoute')
const notificationRoutes = require('./notificationRoute')

const router = express.Router()

router.use('/users',userRoutes)
router.use('/posts',postRoutes)
router.use('/comments',commentRoutes)
router.use('/likes',likeRoutes)
router.use('/shares',shareRoutes)
router.use('/notifications',notificationRoutes)


module.exports = router