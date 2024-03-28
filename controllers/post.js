const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');


// Home page posts
exports.getAllPosts = async (req, res, next) => {

    try {
        const post = await Post.find().populate('author', 'username');
        if(!post) {

            const error = new Error('Sorry, the requested post could not be found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({message : 'Posts are ready', posts : post});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.getSinglePost = async (req, res, next) => {

    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if(!post) {

            const error = new Error('Sorry, the requested post could not be found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({message : 'Post is ready', post : post});
        
    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.addNewComment = async (req, res, next) => {

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

        const receiver = await Post.findById(req.params.id);
        if(!receiver) {
            
            const error = new Error('Sorry, the requested post could not be found.');
            error.statusCode = 404;
            throw error;
        }

        const comment = new Comment({
            comment : req.body.comment,
            senderId : user._id,
            receiverPostId : receiver._id
        });

        await comment.save();

        user.comments.push(comment._id);
        receiver.commentId.push(comment._id);

        await Promise.all([user.save(), receiver.save()]);

        res.status(201).json({message : 'Your comment has been successfully added to the Post. Thank you!', comment : comment._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.likePost = async (req, res, next) => {

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $push : {
                likeId : req.userId
            },
            new : true
        });

        await post.save();

        const user = await User.findByIdAndUpdate(req.userId, {
            $push : {
                likedPosts : post._id
            }
        });

        await user.save();

        res.status(201).json({message : 'Post liked', postId : post._id});

    } catch (error) {

        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.dislike = async (req, res, next) => {

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $pull : {
                likeId : req.userId
            },
            new : true
        });

        await post.save();

        const user = await User.findByIdAndUpdate(req.userId, {
            $pull : {
                likedPosts : post._id
            }
        });

        await user.save();

        res.status(201).json({message : 'Post disliked', postId : post._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}