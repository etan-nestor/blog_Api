const { DataTypes } = require('sequelize');
const { sequelize } = require('../public/config/db');


const User = sequelize.define('User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [3, 20],
            },
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
    timestamps: true,
}
)

module.exports = User
