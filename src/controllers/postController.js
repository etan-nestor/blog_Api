const { Post } = require('../models');
const bcrypt = require('bcrypt');


exports.createPost = async (req, res) => {
    try {
        const { title, image, description, userId } = req.body;
        const post = await Post.create({ title, image, description, UserId: userId });

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({ include: ['User', 'Comments', 'Likes'] });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, description } = req.body;

        const post = await Post.findByPk(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        post.title = title || post.title;
        post.image = image || post.image;
        post.description = description || post.description;

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
