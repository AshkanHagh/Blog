import { Request, Response } from 'express';

import Post from '../models/post.model';
import User from '../models/user.model';
import { IPost, IUser } from '../types/types';
import { validatePost } from '../utils/validator';


export const addPost = async (req : Request, res : Response) => {

    try {
        const { title, description } = req.body;
        const { imageUrl } = req.body;
        const userId : string = req.user._id;

        const { error, value } = validatePost(req.body);

        if(error) return res.status(400).json({error : error.message});

        const currentUser : IUser | null = await User.findById(userId);

        if(!currentUser) return res.status(404).json({error : 'User not found'});

        const post : IPost | null = new Post({
            title,
            description,
            author : currentUser._id
        });

        await post.save();

        res.status(201).json(post);

    } catch (error) {
        
        console.log('error in addPost controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const getPosts = async (req : Request, res : Response) => {

    try {
        const posts : IPost[] = await Post.find({
            isPublish : true
        });

        if(!posts) return res.status(404).json({error : 'Post not found'});

        res.status(200).json(posts);

    } catch (error) {
        
        console.log('error in getPosts controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }
    
}

export const getSinglePost = async (req : Request, res : Response) => {

    try {
        const { id: postId } = req.params;

        const post : IPost | null = await Post.findById(postId);

        if(!post) return res.status(404).json({error : 'Post not found'});

        if(post.isPublish == false) return res.status(400).json({error : 'Post not Published'});

        res.status(200).json(post);

    } catch (error) {
        
        console.log('error in getSinglePost controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const searchPost = async (req : Request, res : Response) => {

    try {
        const { query } = req.params;
        const userId : string = req.user._id;

        const post : IPost[] | null = await Post.find({_id : {$ne : userId}, title : {$regex : query}});

        if(!post) return res.status(400).json({error : 'Posts not found'});

        res.status(200).json(post);

    } catch (error) {
        
        console.log('error in searchPost controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const likePost = async (req : Request, res : Response) => {

    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post : IPost | null = await Post.findById(postId);

        if(!post) return res.status(404).json({error : 'Post not found'});

        const isLiked = post.likes.includes(userId);

        if(isLiked) {

            await Post.findByIdAndUpdate(postId, {$pull : {likes : userId}});

            res.status(200).json({message : 'Post disliked'});

        }else {

            await Post.findByIdAndUpdate(postId, {$push : {likes : userId}});

            res.status(200).json({message : 'Post liked'});
        }

    } catch (error) {
        
        console.log('error in searchPost controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}