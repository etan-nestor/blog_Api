const { Comment } = require('../models');
const bcrypt = require('bcrypt');


exports.addComment = async (req, res) => {
    try {
        const { content, postId } = req.body;

        const comment = await Comment.create({
            content,
            PostId: postId,
            UserId: req.user.id,
        });

        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {

    } catch (error) {

    }
}