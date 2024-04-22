import { Request, Response } from 'express';

import Post from '../models/post.model';
import User from '../models/user.model';
import { IPost, IUser } from '../types/types';


export const updatePost = async (req : Request, res : Response) => {

    try {
        const { title, description, isPublish } = req.body;
        const { imageUrl } = req.body;

        const userId : string = req.user._id;
        const { id: postId } = req.params;
        
        const currentUser = await User.findById<IUser>(userId);

        if(!currentUser) return res.status(404).json({error : 'User not found'});

        const post = await Post.findById<IPost>(postId);

        if(!post) return res.status(404).json({error : 'Post not found'});

        if(isPublish == 'true') {
            post.isPublish = true || post.isPublish
        }

        post.title = title || post.title;
        post.description = description || post.description;

        await post.save();

        res.status(200).json(post);

    } catch (error) {
        
        console.log('error in updatePost controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}