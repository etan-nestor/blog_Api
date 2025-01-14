// import des modules necessaires
const express = require('express');
const { connectDB,sequelize} = require('./public/config/db');
const routes = require('./routes/index')
const cors = require('cors')
const bodyPaser = require('body-parser');

// instance de mon application
const app = express()

// appel de la fonction pour la connexion a la DB
connectDB()

// synchronisation des models avec la DB
sequelize.sync({ alter: true })
    .then(() => console.log("Synchronisation reussie 😊"))
    .catch((err) => console.log('Erreur lors de la synchronisation 😡', err))

// quelques middlewares
app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(cors())


app.use('/api', routes)

// export du module app pour le reste du travail
module.exports = app