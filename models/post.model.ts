import { Schema, model } from 'mongoose';
import type { IPost } from '../types/types';

const postSchema = new Schema<IPost>({

    title : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    isPublish : {
        type : Boolean,
        default : false
    },
    likes : [{
        type : Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }]

}, {timestamps : true});


const Post = model<IPost>('Post', postSchema);

export default Post;