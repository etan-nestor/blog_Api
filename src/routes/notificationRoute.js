const express = require('express')
const {getNotifications,markAsRead} = require('../controllers/notificationController')

const router= express.Router()

router.get('/',getNotifications)
router.delete('/:id',markAsRead)

module.exports = router