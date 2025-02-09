const { Notification } = require('../models/notificationModel');

/**
 * Crée une notification pour un utilisateur spécifique.
 * @param {number} userId - ID de l'utilisateur à notifier.
 * @param {string} message - Contenu de la notification.
 * @param {string} type - Type de notification (new_post, like, comment, etc.).
 * @param {object} io - Instance de Socket.IO pour envoyer la notification en temps réel.
 */
exports.createNotification = async (userId, message, type = 'new_post', io = null) => {
    try {
        const notification = await Notification.create({
            UserId: userId,
            content: message,
            type
        });

        // Envoi en temps réel si io est fourni
        if (io) {
            io.to(`user_${userId}`).emit('notification', {
                id: notification.id,
                content: notification.content,
                type: notification.type,
                isRead: notification.isRead,
                createdAt: notification.createdAt
            });
        }
    } catch (error) {
        console.error(`Error creating notification for user ${userId}:`, error.message);
    }
};

/**
 * Envoie une notification en temps réel à un utilisateur spécifique.
 * @param {object} io - Instance de Socket.IO.
 * @param {number} userId - ID de l'utilisateur cible.
 * @param {string} message - Contenu de la notification.
 * @param {string} type - Type de notification.
 */
exports.sendRealTimeNotification = (io, userId, message, type = 'new_post') => {
    try {
        io.to(`user_${userId}`).emit('notification', {
            content: message,
            type
        });
    } catch (error) {
        console.error(`Error sending real-time notification to user ${userId}:`, error.message);
    }
};

/**
 * Crée et envoie une notification à tous les utilisateurs.
 * @param {object} io - Instance de Socket.IO.
 * @param {string} message - Contenu de la notification.
 * @param {string} type - Type de notification.
 */
exports.notifyAllUsers = async (io, message, type = 'new_post') => {
    try {
        const users = await User.findAll({ attributes: ['id'] });

        for (const user of users) {
            await exports.createNotification(user.id, message, type, io);
        }
    } catch (error) {
        console.error('Error sending notification to all users:', error.message);
    }
};
