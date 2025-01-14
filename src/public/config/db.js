// importation des modules necessaires
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

//configuration du module dotenv pour la prise en charge de l'environnement de travail .env
dotenv.config()

// instance de sequelize : parametre de connexion a ma DB
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
)

// coonnection a ma DB : blog_DB
const connectDB = async () => {``
    try {
        await sequelize.authenticate();
        console.log('Connected to blog_db 😊')
    } catch (error) {
        console.error("Error to connect blog_db", error)
    }
}

// exportation de mes fonctions  (sequelize pour la creation des models , et connectDB pour la connexion a la DB)
module.exports = { sequelize, connectDB }