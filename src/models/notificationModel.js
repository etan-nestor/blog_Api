const { DataTypes } = require('sequelize')
const { sequelize } = require('../public/config/db')

const Notification = sequelize.define('Notification',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        type: {
            type: DataTypes.ENUM('like', 'comment', 'newsletter', 'new_post'),
            allowNull: false,
        }
    },
    {
        timestamps: true
    }
)
module.exports = Notification