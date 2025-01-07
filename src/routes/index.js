const express = require('express')
const userRoutes = require('./userRoute');
const postRoutes = require('./postRoute');
const likeRoutes = require('./likeRoute')
const commentRoutes= require('./commentRoute')
const notificationRoutes = require('./notificationRoute')

const router = express.Router()

router.use('/users',userRoutes)
router.use('/posts',postRoutes)
router.use('/comments',commentRoutes)
router.use('/likes',likeRoutes)
router.use('/notifications',notificationRoutes)


module.exports = router