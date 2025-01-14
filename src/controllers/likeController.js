const { Like } = require('../models');
const bcrypt = require('bcrypt');


exports.likePost = async (req, res) => {
    try {
        const { postId } = req.body;

        const like = await Like.create({
            PostId: postId,
            UserId: req.user.id,
        });

        res.status(201).json({ message: 'Post liked successfully', like });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const { id } = req.params;

        const like = await Like.findOne({
            where: { id, UserId: req.user.id },
        });

        if (!like) return res.status(404).json({ error: 'Like not found' });

        await like.destroy();
        res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
