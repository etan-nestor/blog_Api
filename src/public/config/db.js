const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL successful!');
    } catch (error) {
        console.error('Unable to connect to PostgreSQL:', error);
    }
};

module.exports = { sequelize, connectDB };
