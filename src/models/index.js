const User = require('./userModel')
const Post = require('./postModel')
const Comment = require('./commentModel')
const Like = require('./likeModel')
const Notification = require('./notificationModel')

// Mes relations (relation entre les tables/entites)

User.hasMany(Post,{onDelete:'CASCADE'})
Post.belongsTo(User)

User.hasMany(Comment,{onDelete:'CASCADE'})
Comment.belongsTo(User)

User.hasMany(Like,{onDelete:'CASCADE'})
Like.belongsTo(User)

User.hasMany(Notification,{onDelete:'CASCADE'})
Notification.belongsTo(User)

Post.hasMany(Comment,{onDelete:'CASCADE'})
Comment.belongsTo(Post)

Post.hasMany(Like,{onDelete:'CASCADE'})
Like.belongsTo(Post)

module.exports = {User,Post,Comment,Like,Notification}