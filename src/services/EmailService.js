const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Configuration du transporteur avec des options consolidées
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Utilisation de STARTTLS avec port 587
    secure: false, // False pour STARTTLS, True pour SSL sur port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Accepter les certificats auto-signés en local
    },
    debug: true, // Activer les journaux de débogage
});

// Fonction pour envoyer un e-mail
exports.sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Your Blog App" <${process.env.EMAIL_USER}>`,
            to, // Destinataire
            subject, // Sujet
            text, // Texte brut
            html, // Contenu HTML
        });
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};


// Vérification du transporteur avant d'envoyer des e-mails
transporter.verify((error, success) => {
    if (error) {
        console.error('Error verifying transporter:', error.message);
    } else {
        console.log('Transporter is ready to send emails 😊.');
    }
});
