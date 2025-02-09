const express = require('express')
const { getNotifications, markAsRead } = require('../controllers/notificationController')
const { authenticate } = require('../public/middlewares/authMiddleware.js');

const router = express.Router()

router.get('/', authenticate, getNotifications)
router.delete('/:id', authenticate, markAsRead)

module.exports = router