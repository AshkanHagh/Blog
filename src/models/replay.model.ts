import { Schema, model } from 'mongoose';
import { IReplay } from '../types/types';

const replaySchema = new Schema<IReplay>({

    senderId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    receiverCommentId : {
        type : Schema.Types.ObjectId,
        ref : 'Comment',
        required : true
    },
    text : {
        type : String,
        required : true
    },
    commentId : [{
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    }]

}, {timestamps : true});


const Replay = model<IReplay>('Replay', replaySchema);

export default Replay;