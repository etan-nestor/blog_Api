const { Post, Like, Comment, Share } = require('../models');
const { notifyAllUsers } = require('../services/notificationService');
const { Op } = require("sequelize");


// const { createNotification } = require('../services/notificationService')


exports.createPost = async (req, res) => {
    try {
        const { title, description, content } = req.body;
        const image = req.file ? req.file.path : null;

        const post = await Post.create({ title, image, description, content });
        notifyAllUsers(req.app.get('io'), `Un nouvel article "${title}" a été publié !`, 'new_post');

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        // Récupérer tous les posts
        const posts = await Post.findAll({
            include: [
                { model: Comment, as: "Comments" },
                { model: Like, as: "Likes" },
                { model: Share, as: "Shares" },
            ],
            order: [["createdAt", "DESC"]], // Trier par date décroissante
        });

        // Formater les posts avant de les envoyer
        const formattedPosts = posts.map((post) => ({
            id: post.id,
            title: post.title,
            date: post.createdAt,
            author: post.author,
            comments: post.Comments.length, // Nombre de commentaires
            likes: post.Likes.length, // Nombre de likes
            shares: post.Shares.length, // Nombre de partages
            image: post.image, // URL de l'image
        }));

        res.status(200).json(formattedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null; // Vérifie si l'utilisateur est authentifié

        if (!id) {
            return res.status(400).json({ message: "ID manquant" });
        }

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) { // Vérifie si l'ID est un UUID
            return res.status(400).json({ message: "ID invalide" });
        }

        const post = await Post.findByPk(id, {
            attributes: ["id", "title", "description", "image", "content", "createdAt"],
            include: [
                { model: Comment, attributes: ["id"] },
                { model: Like, attributes: ["id", "UserId"] },
                { model: Share, attributes: ["id"] },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: "Post introuvable" });
        }

        // Vérifie si l'utilisateur actuel a liké ce post
        const isLikedByUser = userId ? post.Likes.some(like => like.UserId === userId) : false;

        const response = {
            ...post.toJSON(),
            likesCount: post.Likes.length,
            commentsCount: post.Comments.length,
            sharesCount: post.Shares.length,
            isLikedByUser, // Ajout de cette information
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getRecentsPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: Comment, // Assurez-vous que 'Comment' est bien défini dans vos relations
                    as: 'Comments', // Alias pour la relation
                    attributes: ['content'] // Vous pouvez ajouter d'autres champs si nécessaire
                },
                {
                    model: Like, // Assurez-vous que 'Like' est bien défini dans vos relations
                    as: 'Likes', // Alias pour la relation
                    attributes: ['id'] // Vous pouvez ajouter d'autres champs si nécessaire
                },
                {
                    model: Share, // Assurez-vous que 'Like' est bien défini dans vos relations
                    as: 'Shares', // Alias pour la relation
                    attributes: ['id'] // Vous pouvez ajouter d'autres champs si nécessaire
                },
            ],
            order: [['createdAt', 'DESC']], // Tri par createdAt décroissant
        });
        // Ajout de l'auteur fixe pour chaque post
        const postsWithAuthor = posts.map(post => ({
            ...post.toJSON(),
            author: "Nestor COMPAORE", // L'auteur est désormais fixé
        }));
        res.status(200).json(postsWithAuthor); // Envoie la réponse avec les posts récupérés
    } catch (error) {
        res.status(500).json({ error: error.message }); // Gère les erreurs éventuelles
    }
};


exports.getPopularPosts = async (req, res) => {
    try {
        // Récupérer les posts populaires triés par nombre de likes décroissant
        const posts = await Post.findAll({
            include: [
                {
                    model: Comment,
                    as: "Comments", // Récupérer les commentaires associés
                    attributes: ["id"],
                },
                {
                    model: Like,
                    as: "Likes", // Récupérer les likes associés
                    attributes: ["id"],
                },
                {
                    model: Share,
                    as: "Shares", // Récupérer les partages associés
                    attributes: ["id"],
                },
            ],
        });
        const postsWithLikes = posts.map(async (post) => {
            const likesCount = await Like.count({
                where: { PostId: post.id }, // Compter les likes associés à ce post
            });
            return {
                ...post.dataValues, // Conserver les données du post
                likesCount, // Ajouter le nombre de likes calculé
            };
        });

        // Attendre que tous les calculs de likes soient terminés
        const popularPosts = await Promise.all(postsWithLikes);

        // Trier les posts par le nombre de likes (ordre décroissant)
        popularPosts.sort((a, b) => b.likesCount - a.likesCount);

        // Limiter les résultats à 10 posts populaires
        const topPosts = popularPosts.slice(0, 10);

        res.status(200).json(topPosts); // Répondre avec les posts populaires
    } catch (error) {
        console.error(error); // Afficher l'erreur dans la console pour le débogage
        res.status(500).json({ error: error.message }); // Répondre avec un message d'erreur
    }
};

exports.getArchivedPosts = async (req, res) => {
    try {
        // Recherchez les posts dont la date est antérieure à aujourd'hui (posts archivés)
        const posts = await Post.findAll({
            where: {
                createdAt: { [Op.lt]: new Date() } // Articles dont la date est antérieure à aujourd'hui
            },
            include: [
                {
                    model: Comment, // Assurez-vous que 'Comment' est bien défini dans vos relations
                    as: 'Comments', // Alias pour la relation
                    attributes: ['content'] // Vous pouvez ajouter d'autres champs si nécessaire
                },
                {
                    model: Like, // Assurez-vous que 'Like' est bien défini dans vos relations
                    as: 'Likes', // Alias pour la relation
                    attributes: ['id'] // Vous pouvez ajouter d'autres champs si nécessaire
                },
                {
                    model: Share, // Assurez-vous que 'Like' est bien défini dans vos relations
                    as: 'Shares', // Alias pour la relation
                    attributes: ['id'] // Vous pouvez ajouter d'autres champs si nécessaire
                },
            ],
            order: [['createdAt', 'ASC']], // Tri par date décroissante
            limit: 20, // Retourne les 20 derniers articles archivés
        });

        // Formater les posts avant de les renvoyer
        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            date: post.createdAt,
            author: post.author,
            commentsCount: post.Comments.length, // Nombre de commentaires
            likesCount: post.Likes.length, // Nombre de likes
            sharesCount: post.Shares.length, // Nombre de partages
            image: post.image, // Lien de l'image
        }));

        res.status(200).json(formattedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSharedPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        const sharedPosts = await Share.findAll({
            where: { userId },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'createdAt'],
                    include: [{ model: User, attributes: ['username'] }],
                },
            ],
        });

        res.json({ sharedPosts: sharedPosts.map(share => share.Post) });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.getCommentedPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        const commentedPosts = await Comment.findAll({
            where: { userId },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'createdAt'],
                    include: [{ model: User, attributes: ['username'] }],
                },
            ],
            group: ['Post.id'], // Éviter les doublons si l'utilisateur a commenté plusieurs fois le même post
        });

        res.json({ commentedPosts: commentedPosts.map(comment => comment.Post) });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.getLikedPosts = async (req, res) => {
    try {
        const userId = req.user.id; // ID de l'utilisateur connecté

        const likedPosts = await Like.findAll({
            where: { userId },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'createdAt'],
                    include: [{ model: User, attributes: ['username'] }],
                },
            ],
        });

        res.json({ likedPosts: likedPosts.map(like => like.Post) });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};


exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, description, content } = req.body;

        const post = await Post.findByPk(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        post.title = title || post.title;
        post.image = image || post.image;
        post.description = description || post.description;
        post.content = content || post.content;

        await post.save();
        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findByPk(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};