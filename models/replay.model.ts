import { Schema, model } from 'mongoose';
import type { IReplay } from '../types/types';

const replaySchema = new Schema<IReplay>({

    senderId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    commentId : {
        type : Schema.Types.ObjectId,
        ref : 'Comment',
        required : true
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'Post',
    },
    text : {
        type : String,
        required : true
    }

}, {timestamps : true});


const Replay = model<IReplay>('Replay', replaySchema);

export default Replay;