import { Request, Response } from 'express';

import Post from '../models/post.model';
import User from '../models/user.model';
import Comment from '../models/comment.model';
import Replay from '../models/replay.model';
import { ILikeData, IPost, IUser } from '../types/types';
import { validatePostUpdate } from '../utils/validator';


export const updatePost = async (req : Request, res : Response) => {

    try {
        const { title, description, isPublish } = req.body;
        const { imageUrl } = req.body;

        const { error, value } = validatePostUpdate(req.body);

        if(error) return res.status(400).json({error : error.message});

        const userId : string = req.user._id;
        const { id: postId } = req.params;
        
        const currentUser : IUser | null = await User.findById(userId);

        if(!currentUser) return res.status(404).json({error : 'User not found'});

        const post : IPost | null = await Post.findById(postId);

        if(!post) return res.status(404).json({error : 'Post not found'});

        if(isPublish == 'true') {
            post.isPublish = true || post.isPublish
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.imageUrl = imageUrl || post.imageUrl

        await post.save();

        res.status(200).json(post);

    } catch (error) {
        
        console.log('error in updatePost controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const deletePost = async (req : Request, res : Response) => {

    try {
        const {id: postId} = req.params;
        const userId = req.user._id;
        
        const post : IPost | null = await Post.findById(postId);

        if(!post) return res.status(404).json({error : 'Post not found'});

        if(post.author.toString() !== userId.toString()) return res.status(400).json({error : 'Cannot delete others post'});

        await Comment.deleteMany({receiverPostId : post._id});
        await Replay.deleteMany({postId : post._id});

        await post.deleteOne();

        res.status(200).json({message : 'Post has been deleted'});

    } catch (error) {
        
        console.log('error in deletePost controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const whoIsLiked = async (req: Request, res: Response) => {
    try {
        const { id: postId } = req.params;

        const post: IPost | null = await Post.findById(postId).select('likes').lean();

        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        const likedUsers: IUser[] = await User.find({ _id: { $in: post.likes } });

        const mappedPost: ILikeData[] = likedUsers.map((user: IUser) => ({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic || ''
        }));

        res.status(200).json(mappedPost);

    } catch (error) {

        console.log('error in whoIsLiked controller :', error);

        res.status(500).json({error: 'Internal server error'});
    }
};