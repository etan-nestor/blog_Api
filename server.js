//import des modules necessaires
const app = require('./src/app')
const dotenv = require('dotenv')

// Declaration de mon port d'acces au serveur
const PORT = process.env.PORT || 5000

// lancement du serveur : le serveur attend sur : https://localhost:5000
app.listen(PORT,()=>{
    console.log(`server running on : https://localhost:${PORT}`)
})