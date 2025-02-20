// Importation des modules nécessaires
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Configuration du module dotenv pour charger les variables d'environnement
dotenv.config();


// Nouvelle instance Sequelize avec DATABASE_URL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
});


// Fonction de connexion à la DB
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connecté à PostgreSQL 🎉');
    } catch (error) {
        console.error('❌ Erreur de connexion à PostgreSQL :', error);
    }
};

// Exportation des fonctions (sequelize pour les modèles, connectDB pour la connexion)
module.exports = { sequelize, connectDB };
