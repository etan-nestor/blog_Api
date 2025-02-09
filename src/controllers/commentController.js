const { Comment, User, Post } = require('../models');
const bcrypt = require('bcrypt');


// Ajouter un commentaire sur un post
exports.addComment = async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    try {
        // Vérifier si le post existe
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }

        // Créer le commentaire
        const comment = await Comment.create({
            content,
            PostId: postId,
            UserId: req.user.id,
        });


        // Récupérer l'utilisateur associé au commentaire
        const user = await User.findByPk(req.user.id);

        // Récupérer les commentaires mis à jour
        const comments = await Comment.findAll({
            where: { PostId: postId },
            include: [{ model: User, attributes: ['id', 'username'] }],
            order: [['createdAt', 'ASC']],
        });

        res.status(201).json({
            comment: { ...comment.toJSON(), User: { username: user.username } },  // Ajouter le username
            comments: comments,
            commentsCount: comments.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire' });
    }
};



exports.getComments = async (req, res) => {
    const { postId } = req.params; // On extrait postId des paramètres de l'URL

    try {
        // Récupérer les commentaires du post spécifié
        const comments = await Comment.findAll({
            where: { PostId: postId }, // Utiliser postId ici
            include: [{ model: User, attributes: ['id', 'username', 'photo'] }],  // Inclure l'utilisateur avec chaque commentaire
            order: [['createdAt', 'DESC']],  // Trier les commentaires par date
        });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: 'Aucun commentaire trouvé pour ce post' });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
    }
};


exports.deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }

        // Vérifier que l'utilisateur est bien l'auteur du commentaire ou un administrateur
        if (comment.userId !== req.user.id) {
            return res.status(403).json({ message: 'Accès interdit. Vous n\'êtes pas l\'auteur de ce commentaire' });
        }

        await comment.destroy();  // Supprimer le commentaire
        res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' });
    }
};
