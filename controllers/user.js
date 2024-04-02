const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const path = require('path');
const fs = require('fs');

const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');


// Get profile info || posts || comments || likes
exports.getUserProfile = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user) {

            const error = new Error('Sorry, the requested user could not be found.');
            error.statusCode = 404;
            throw error;
        }

        const post = await Post.find({author : user._id}).limit(3).sort({_id : -1}).populate('author', 'username').populate('commentId', 'comment');
        if(!post) {

            const error = new Error('Sorry, the requested post could not be found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({message : 'your profile is ready', userInfo : user, posts : post});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


// all posts user uploaded || post liked || post commented
exports.userActivity = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId).sort({_id : -1}).populate(['posts', 'comments']).populate('likedPosts', 'title');
        if(!user) {

            const error = new Error('Sorry, the requested user could not be found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({message : 'Activity loaded successfully!', posts : user.posts, comments : user.comments, likedPosts : user.likedPosts});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


// update only password
exports.updatePassword = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const { password, confirmPassword } = req.body;

        
        const isUser = await User.findById(req.userId);

        const isPassword = await bcrypt.compare(confirmPassword, isUser.password);

        if(!isPassword) {

            const error = new Error('Access denied. Incorrect password');
            error.statusCode = 403
            throw error;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(password, salt);

        await isUser.updateOne({
            $set : { password : hashedPass}
        });

        await isUser.save();

        res.status(201).json({message : 'Password updated', userId : isUser._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


// update all user info like email username
exports.updateProfile = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const { username, email } = req.body;

        const user = await User.findById(req.userId);
        if(!user) {

            const error = new Error('Access denied');
            error.statusCode = 403;
            throw error;
        }

        await user.updateOne({
            $set : {
                username,
                email
            }
        });

        await user.save();

        res.status(201).json({message : 'Profile updated successfully', userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


// create a new post for blog
exports.createPost = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const user = await User.findById(req.userId);
        if(!user) {

            const error = new Error('Sorry, the requested user could not be found.');
            error.statusCode = 404;
            throw error;
        }

        const { title, info, description } = req.body;

        if(!req.file) {

            const error = new Error('Please upload a image')
            error.statusCode = 422;
            throw error;
        }

        const post = new Post({
            
            title,
            info,
            description,
            image : req.file.path,
            author : user._id
        });

        await post.save();

        user.posts.push(post._id);

        await user.save();

        res.status(201).json({message : 'Post created successfully', PostId : post._id, author : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.editPost = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }
        
        const { info, title, description } = req.body;

        const post = await Post.findById(req.params.id);
        if(!post) {

            const error = new Error('Sorry. requested post could not found');
            error.statusCode = 404;
            throw error;
        }

        let image = req.body.image;
        if(req.file) {

            image = req.file.path;
        }

        if(image != post.image && image != 'undefined') {

            clearImage(post.image);

            await post.updateOne({
                $set : {image}
            });
        }

        await post.updateOne({
            $set : {
                info,
                title,
                description
            }
        });

        await post.save();

        res.status(201).json({message : 'Post has been updated', postId : post._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {

            const error = new Error('Sorry. requested post could not found');
            error.statusCode = 404;
            throw error;
        }

        clearImage(post.image);

        await post.deleteOne();
 
        await Comment.deleteMany({ receiverPostId: post._id });

        const users = await User.find({
            $or: [

                { posts: post._id },
                { comments: { $in: post.commentId } },
                { likedPosts: post._id }
            ]
        });
        if(!users) {

            const error = new Error('Sorry. requested user could not found');
            error.statusCode = 404;
            throw error;
        }

        await Promise.all(users.map(async user => {
            if (user.posts.includes(post._id)) {

                user.posts.pull(post._id);
            }

            user.comments = user.comments.filter(commentId => !post.commentId.includes(commentId));
            user.likedPosts.pull(post._id);

            await user.save();
        }));

        res.status(200).json({message : 'Post has been deleted', PostId : post._id});

    } catch (error) {

        if (!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }
}



const clearImage = (filePath) => {

    filePath = path.join(__dirname, '..', filePath);

    if(fs.existsSync(filePath)) {

        fs.unlinkSync(filePath);
        console.log('image deleted');
    }
    else {
        console.log('image not found');
    }

}