const http = require('http'); // Import du module HTTP
const app = require('./src/app');
const { Server } = require('socket.io');

// Création du serveur HTTP basé sur Express
const server = http.createServer(app);

// Initialisation de Socket.IO avec le serveur HTTP
const io = new Server(server, { cors: { origin: '*' } });

// Ajouter io à l'application pour l'utiliser ailleurs
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
