const User = require('./userModel')
const Post = require('./postModel')
const Share = require('./shareModel')
const Comment = require('./commentModel')
const Like = require('./likeModel')
const Notification = require('./notificationModel')

// Mes relations (relation entre les tables/entites)

User.hasMany(Share, { onDelete: 'CASCADE' });
Share.belongsTo(User);

Post.hasMany(Share, { onDelete: 'CASCADE' });
Share.belongsTo(Post);

User.hasMany(Comment, { onDelete: 'CASCADE' })
Comment.belongsTo(User)

User.hasMany(Like, { onDelete: 'CASCADE' })
Like.belongsTo(User)

User.hasMany(Notification, { onDelete: 'CASCADE' })
Notification.belongsTo(User)

Notification.belongsTo(Post, { onDelete: 'CASCADE' });

Post.hasMany(Comment, { onDelete: 'CASCADE' })
Comment.belongsTo(Post)

Post.hasMany(Like, { onDelete: 'CASCADE' })
Like.belongsTo(Post)



module.exports = { User, Share, Post, Comment, Like, Notification }