const {DataTypes} = require('sequelize')
const {sequelize} = require('../public/config/db')

const Comment = sequelize.define('Comment',
    {
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            allowNull:false,
            primaryKey:true,
        },
        content:{
            type:DataTypes.TEXT,
            allowNull:false,
        }
    },
{timestamps:true}
)

module.exports = Comment