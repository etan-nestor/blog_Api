// Import des modules nécessaires
const express = require('express');
const { connectDB, sequelize } = require('./public/config/db');
const routes = require('./routes/index');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

// Instance de l'application
const app = express();

// Publier le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connexion à la base de données
connectDB();

// Configuration de stockage Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Répertoire de stockage
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nom unique
    },
});

const upload = multer({ storage });

// Middleware pour ajouter Multer aux routes ciblées
app.use((req, res, next) => {
    if (req.path.startsWith('/api/posts') || req.path.startsWith('/api/users')) {
        req.upload = upload;
    }
    next();
});

// Synchronisation des modèles Sequelize
sequelize.sync({ alter: true })
    .then(() => console.log("Synchronisation réussie 😊"))
    .catch((err) => console.log('Erreur lors de la synchronisation 😡', err));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api', routes);

// Export de l'application
module.exports = app;
