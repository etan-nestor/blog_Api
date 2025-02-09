// Import de mes modules necessaires
const User = require("../models/userModel");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/EmailService");

// Fonctionnalite d'insciption pour un utilisateur : controller 1
exports.userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email: email }, { username: username }],
            },
        });

        if (existingUser) {
            return res
                .status(409)
                .json({ error: "User already exists. Please login." });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Envoi de la réponse en cas de succès
        res.status(201).json({ message: "Inscription réussie", user });
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while registering the user." });
    }
};

// Fonctionnalite de connexion pour un utilisateur : controller 2
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

        // Génération du token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        }); // Expiration de 1h

        res.status(200).json({
            message: "Connexion réussie",
            token, // Inclure le token dans la réponse
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Fonctionnalites de reset password pour un utilisateur : controller 3
exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Rechercher l'utilisateur
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Génération du jeton de réinitialisation
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const htmlBody = `
            <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de Mot de Passe</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      max-width: 600px;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .header {
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .icon {
      font-size: 50px;
      color: #007BFF;
      margin-bottom: 20px;
    }

    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    a.reset-link {
      display: inline-block;
      background-color: #007BFF;
      color: #fff;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    a.reset-link:hover {
      background-color: #0056b3;
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }

    .footer {
      font-size: 14px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔒</div>
    <div class="header">Réinitialisation de votre Mot de Passe</div>
    <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour continuer:</p>
    <a href="${resetLink}" class="reset-link">Réinitialiser mon mot de passe</a>
    <p class="footer">Si vous n'avez pas demandé cette modification, ignorez cet e-mail ou contactez notre support.</p>
  </div>
</body>
</html>

        `
        // Envoi de l'e-mail
        await sendEmail(
            user.email,
            "Password Reset Request",
            `Reset your password using this link: ${resetLink}`,
            htmlBody
        );

        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res
            .status(500)
            .json({ error: "An error occurred while sending the reset link" });
    }
};

// confirm reset password
exports.ConfirmResetPassword = async (req, res) => {
    try {
        // Récupérer le token depuis les en-têtes 'Authorization'
        const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

        // Vérification si le token est présent
        if (!token) return res.status(400).json({ error: "Token is required" });

        const { newPassword } = req.body;

        // Validation des champs
        if (!newPassword)
            return res.status(400).json({ error: "New password is required" });

        // Décoder le jeton
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Rechercher l'utilisateur
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Mettre à jour le mot de passe
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        const emailHTML = `
          <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de Réinitialisation de Mot de Passe</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      width: 100%;
      max-width: 600px;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      text-align: center;
    }

    h1 {
      color: #333;
      font-size: 24px;
      margin-bottom: 20px;
    }

    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .button {
      background-color: #4CAF50;
      color: white;
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      text-decoration: none;
      display: inline-block;
      margin: 20px auto;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    .button:hover {
      background-color: #45a049;
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }

    .footer {
      font-size: 14px;
      color: #888;
      margin-top: 20px;
    }

    .icon {
      font-size: 48px;
      color: #4CAF50;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">✔️</div>
    <h1>Confirmation de Réinitialisation de Mot de Passe</h1>
    <p>Votre mot de passe a été réinitialisé avec succès. Si vous n'avez pas demandé cette modification, veuillez contacter immédiatement le support.</p>
    <a href="${process.env.FRONTEND_URL}/signin" class="button">Accéder à la Connexion</a>
    <p class="footer">Si vous n'avez pas demandé cette modification, contactez notre équipe de support.</p>
  </div>
</body>
</html>

        `;
        // Envoyer un e-mail de confirmation après la réinitialisation réussie
        await sendEmail(
            user.email,
            "Password Reset Confirmation",
            "Your password has been successfully reset.",
            emailHTML
        );

        res
            .status(200)
            .json({
                message: "Password reset successfully, confirmation email sent",
            });
    } catch (error) {
        console.error("Error resetting password:", error.message);
        res
            .status(500)
            .json({ error: "An error occurred while resetting the password" });
    }
};

// Fonctionnalite de supression de compte utilisateur : controller 3
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        await user.destroy();
        res.status(201).json({ message: "Account deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Fonctionnalites de mise a jour profile pour l'utilisateur : controller 4
exports.updateUserAccount = async (req, res) => {
    try {
        const { username, email, phoneNumber, profileImage } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phoneNumber || user.phone;
        user.photo = profileImage || user.photo;
        await user.save();
        res.status(201).json({ message: "Profil Updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonctionnalites pour lister tout mes utilisateurs : controller 5
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users) return res.status(404).json({ error: "No Users Found" });
        res.status(201).json({ message: "All users list", users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        await user.destroy();
        res.status(201).json({ message: "Deleting Successfull" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
