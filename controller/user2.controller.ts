import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import User from '../models/user.model';
import Post from '../models/post.model';
import type { IPost, IUser } from '../types/types';


export const searchUser = async (req : Request, res : Response) => {

    try {
        const { query } = req.params;

        let user :  IUser | null;

        if(mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({_id : query});

        }else {
            user = await User.findOne({username : query});
        }

        if(!user) return res.status(404).json({error : 'User not found'});

        if(user.isFreeze == true) return res.status(200).json({message : 'This Account is been freezed'});

        res.status(200).json(user);

    } catch (error) {
        
        console.log('error in searchUser controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const freezeAccount = async (req : Request, res : Response) => {

    try {
        res.cookie('jwt', '', {maxAge : 1});

        await User.findByIdAndUpdate(req.user._id, {isFreeze : true});

        res.status(200).json({message : 'Account freezed successfully'});

    } catch (error) {
        
        console.log('error in freezeAccount controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const follow = async (req : Request, res : Response) => {

    try {
        const { id } = req.params;
        const userId : string = req.user._id;

        const userToModify : IUser | null = await User.findById(id);
        const currentUser : IUser | null =  await User.findById(userId);

        if(id === userId) return res.status(400).json({error : 'You cannot follow/unFollow your self'});
        if(!userToModify || !currentUser) return res.status(404).json({error : 'User not found'});

        const isFollowing : boolean = currentUser.following.includes(id);

        if(isFollowing) {
            // unFollow
            await User.findByIdAndUpdate(req.user._id, {$pull : {following : id}});
            await User.findByIdAndUpdate(id, {$pull : {followers : req.user._id}});

            res.status(200).json({message : 'User unFollowed successfully'});

        }else {
            // follow
            await User.findByIdAndUpdate(req.user._id, {$push : {following : id}});
            await User.findByIdAndUpdate(id, {$push : {followers : req.user._id}});

            res.status(200).json({message : 'User followed successfully'});
        }

    } catch (error) {
        
        console.log('error in follow controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const followers = async (req: Request, res: Response) => {
    try {
        const { id: userToModify } = req.params;

        const user: IUser | null = await User.findById(userToModify);

        if (!user) return res.status(404).json({error: 'User not found'});

        const followers: IUser[] | null = await User.find({_id: { $in: user.followers}});

        if (!followers) return res.status(404).json({error: 'Followers not found'});

        const mappedFollowers = followers.map((follower: IUser) => ({

            _id: follower._id,
            fullName: follower.fullName,
            username: follower.username,
            profilePic: follower.profilePic
        }));

        res.status(200).json(mappedFollowers);

    } catch (error) {

        console.log('error in followers controller :', error);

        res.status(500).json({error: 'Internal server error'});
    }
};


export const followings = async (req : Request, res : Response) => {

    try {
        const { id: userToModify } = req.params;

        const user : IUser | null = await User.findById(userToModify);

        if(!user) return res.status(404).json({error : 'User not found'});

        const followings : IUser[] | null = await User.find({_id : {$in : user.following}});

        if (!followers) return res.status(404).json({error: 'Followers not found'});

        const mappedFollowings = followings.map((following : IUser) => ({

            _id : following._id,
            fullName : following.fullName,
            username : following.username,
            profilePic : following.profilePic
        }));

        res.status(200).json(mappedFollowings);

    } catch (error) {
        
        console.log('error in followers controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}

export const getMyPosts = async (req : Request, res : Response) => {

    try {
        const userId : string = req.user._id;

        const post : IPost[] = await Post.find({author : userId}).select('-updatedAt');

        if(!post) return res.status(404).json({error : 'Post not found'});

        res.status(200).json(post);

    } catch (error) {
        
        console.log('error in getMyPosts controller :', error);

        res.status(500).json({error : 'Internal server error'});
    }

}