const { validationResult } = require('express-validator');

const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');


exports.editComment = async (req, res, next) => {

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

        const comment = await Comment.findById(req.params.id);
        if(!comment) {

            const error = new Error('Sorry, the requested comment could not be found.');
            error.statusCode = 404;
            throw error;
        }

        if(comment.senderId.toString() != req.userId) {
            
            const error = new Error('not authorized');
            error.statusCode = 403;
            throw error;
        }

        await comment.updateOne({
            $set : {
                comment : req.body.comment
            }
        });

        res.status(201).json({message : 'comment has been updated', comment : comment._id});
        
    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.deleteComment = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId);
        if(!user) {
            
            const error = new Error('Sorry, the requested user could not be found.');
            error.statusCode = 404;
            throw error;
        }

        const comment = await Comment.findById(req.params.id);
        if(!comment) {
            
            const error = new Error('Sorry, the requested comment could not be found.');
            error.statusCode = 404;
            throw error;
        }
        
        const post = await Post.findById(comment.receiverPostId);
        if(!post) {
            
            const error = new Error('Sorry, the requested post could not be found.');
            error.statusCode = 404;
            throw error;
        }

        await comment.deleteOne();

        await post.commentId.remove(comment._id);
        await user.comments.remove(comment._id);

        await Promise.all([post.save(), user.save()]);

        res.status(200).json({message : 'comment deleted', commentId : comment._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}