// Importation des modules nécessaires
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Configuration du module dotenv pour charger les variables d'environnement
dotenv.config();

// Nouvelle instance Sequelize avec DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // Important pour Railway
            rejectUnauthorized: false, // Évite les erreurs SSL
        },
    },
    logging: false, // Désactive les logs SQL dans la console
});

// Fonction de connexion à la DB
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connecté à PostgreSQL sur Railway 🎉');
    } catch (error) {
        console.error('❌ Erreur de connexion à PostgreSQL :', error);
    }
};

// Exportation des fonctions (sequelize pour les modèles, connectDB pour la connexion)
module.exports = { sequelize, connectDB };
