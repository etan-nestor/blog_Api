const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/item.routes');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/items', itemRoutes);

module.exports = app;
