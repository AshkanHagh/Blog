import type { Request, Response } from "express";

import User from "../models/user.model";
import Post from "../models/post.model";
import type  { IComment, IPost, IReplay, IUser } from "../types/types";
import Comment from "../models/comment.model";
import Replay from "../models/replay.model";

export const addComment = async (req : Request, res : Response) => {

    try {
        const { text } = req.body;

        const { id: postId } = req.params;
        const currentUser : string = req.user._id;

        const user : IUser | null = await User.findById(currentUser);

        if(!user) return res.status(404).json({error : 'User not found'});

        const post : IPost | null = await Post.findById(postId);

        if(!post) return res.status(404).json({error : 'Post not found'});

        if(post.isPublish == false) return res.status(400).json({error : 'This Post is not publish'});

        const newComment : IComment | null = new Comment({

            senderId : user._id,
            receiverPostId : post._id,
            text
        });

        await newComment.save();

        res.status(201).json(newComment);

    } catch (error) {
        
        console.log('error in addComment controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const deleteComment = async (req : Request, res : Response) => {

    try {
        const { id: commentId } = req.params;
        const currentUser : string = req.user._id;

        const comment : IComment | null = await Comment.findById(commentId);

        if(currentUser.toString() !== comment.senderId.toString()) return res.status(400).json({error : 'Cannot delete others comment'});

        await Replay.deleteMany({commentId : {$in : comment._id}});

        await comment.deleteOne();

        res.status(200).json({message : 'Comment deleted'});

    } catch (error) {
        
        console.log('error in deleteComment controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const getComments = async (req : Request, res : Response) => {

    try {
        const { id: postId } = req.params;

        const comment : IComment[] = await Comment.find({receiverPostId : postId}).populate('senderId', 'fullName username profilePic').
        select(' -updatedAt -replay');

        if(!comment) return res.status(404).json({error : 'Comment not found'});

        res.status(200).json(comment);

    } catch (error) {
        
        console.log('error in getComments controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const editComment = async (req : Request, res : Response) => {

    try {
        const { text } = req.body;

        const { id: commentId } = req.params;
        const currentUser : string = req.user._id;

        const comment : IComment | null = await Comment.findById(commentId).select('-updatedAt');

        if(currentUser.toString() !== comment.senderId.toString()) return res.status(400).json({error : 'Cannot edit others comment'});

        if(!comment) return res.status(404).json({error : 'Comment not found'});

        comment.text = text;

        await comment.save();

        res.status(200).json(comment);

    } catch (error) {
        
        console.log('error in editComment controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const replay = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const { id: commentId } = req.params;
        const currentUser = req.user._id;

        const replay: IReplay | null = await Replay.create({

            senderId: currentUser,
            commentId: commentId,
            postId: null,
            text
        });

        const updatedComment = await Comment.findByIdAndUpdate(commentId, {

            $push: { replay: replay._id }
        }, { new: true });

        if (!updatedComment) {

            await Replay.findByIdAndDelete(replay._id);

            return res.status(404).json({ error: 'Comment not found' });
        }

        replay.postId = updatedComment.receiverPostId;
        
        await replay.save();

        res.status(200).json(replay);

    } catch (error) {

        console.log('error in replay controller:', error);

        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getReplays = async (req : Request, res : Response) => {

    try {
        const { id } = req.params;

        const replay : IReplay[] = await Replay.find({commentId : id}).sort({createdAt : -1});

        if(!replay) return res.status(404).json({error : 'Replay not found'});

        res.status(200).json(replay);

    } catch (error) {
        
        console.log('error in getReplays controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const likeComment = async (req : Request, res : Response) => {

    try {
        const { id: commentId } = req.params;
        const currentUser = req.user._id;

        const comment : IComment | null = await Comment.findById(commentId);

        if(!comment) return res.status(404).json({error : 'Comment not found'});

        const isLiked = comment.likes.includes(currentUser);

        if(isLiked) {

            await Comment.findByIdAndUpdate(commentId, {$pull : {likes : currentUser}});

            res.status(200).json({message : 'Comment disLiked'});
        }else {

            await Comment.findByIdAndUpdate(commentId, {$push : {likes : currentUser}});

            res.status(200).json({message : 'Comment liked'});
        }
        
    } catch (error) {
        
        console.log('error in likeComment controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}