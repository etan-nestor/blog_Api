// import des modules necessaires
const express = require('express');
const { connectDB } = require('./public/config/db');
const { sequelize } = require('./public/config/db')
const cors = require('cors')
const bodyPaser = require('body-parser');

// instance de mon application
const app = express()

// synchronisation des models avec la DB

sequelize.sync({ alter: false })
    .then(() => console.log("Synchronisation reussie 😊"))
    .catch((err) => console.log('Erreur lors de la synchronisation 😡', err))

// appel de la fonction pour la connexion a la DB
connectDB()

// quelques middlewares
app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(cors())

// export du module app pour le reste du travail
module.exports = app