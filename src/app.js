const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// l'instance de mon app express
const app = express();

// connect to DB
const { connectDB } = require('./public/config/db');
connectDB();

// Middlewares 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Blog API!');
});


module.exports = app;
