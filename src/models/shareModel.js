const {DataTypes} = require('sequelize')
const {sequelize} = require('../public/config/db')

const Share = sequelize.define('Share', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
}, {
    timestamps: true,
});

module.exports = Share;

