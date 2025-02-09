const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const User = require("../../models/userModel");


dotenv.config();

exports.authenticate = async (req, res, next) => {
    try {
        // Extraire le token de l'en-tête Authorization
        const token = req.headers.authorization?.split(' ')[1];

        // Vérification de la présence du token
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // console.log('Token reçu:', token); // Log du token reçu

        // Vérification du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log(`Decoded token:`, decoded); // Log du decoded token

        // Recherche de l'utilisateur dans la base de données
        const user = await User.findByPk(decoded.id);

        // Vérification de l'existence de l'utilisateur
        if (!user) {
            return res.status(401).json({ error: 'User not found or invalid token.' });
        }

        // Ajouter l'utilisateur au requête
        req.user = user;
        next();
    } catch (error) {
        // console.error('Authentication error:', error.message);
        res.status(401).json({ error: 'Authentication failed. Invalid or expired token.' });
    }
};