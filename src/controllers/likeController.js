const { Like, Post } = require('../models');
const bcrypt = require('bcrypt');


exports.likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id;

        // Vérifier si l'utilisateur a déjà liké ce post
        const existingLike = await Like.findOne({
            where: { PostId: postId, UserId: userId },
        });

        if (existingLike) {
            return res.status(400).json({ message: 'Post déjà liké.' });
        }

        // Ajouter un nouveau like
        await Like.create({
            PostId: postId,
            UserId: userId,
        });

        // Incrémenter le compteur de likes dans la table des posts
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé.' });
        }
        post.likesCount += 1;
        await post.save();

        res.status(201).json({ message: 'Post liké avec succès.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        // Trouver le like
        const like = await Like.findOne({
            where: { PostId: postId, UserId: userId },
        });

        if (!like) {
            return res.status(404).json({ message: 'Like non trouvé.' });
        }

        // Supprimer le like
        await like.destroy();

        // Décrémenter le compteur de likes dans la table des posts
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé.' });
        }
        post.likesCount -= 1;
        await post.save();

        res.status(200).json({ message: 'Post unliké avec succès.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
