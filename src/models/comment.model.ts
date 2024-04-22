import mongoose from 'mongoose';
import { IComment } from '../types/types';

const commentSchema = new mongoose.Schema<IComment>({

    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    text : {
        type : String,
        required : true
    }

}, {timestamps : true});


const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;