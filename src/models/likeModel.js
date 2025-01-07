const { DataTypes } = require('sequelize');
const { sequelize } = require('../public/config/db')

const Like = sequelize.define('Like',
    {},
    { timestamps: true }
)

module.exports = Like