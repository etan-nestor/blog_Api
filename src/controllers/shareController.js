const { Post, Share } = require('../models');
const { Op } = require("sequelize");

exports.sharePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id; // Récupérer l'utilisateur authentifié

        // Vérifier si le post existe
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        // Créer un partage
        await Share.create({ UserId: userId, PostId: postId });

        // Mettre à jour le nombre de partages
        await post.increment('sharesCount');

        res.status(201).json({ message: "Post partagé avec succès", sharesCount: post.sharesCount + 1 });
    } catch (error) {
        console.error("Erreur lors du partage :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};