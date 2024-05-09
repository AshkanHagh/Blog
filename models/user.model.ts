import { Schema, model } from 'mongoose';
import type { IUser } from '../types/types';

const userSchema = new Schema<IUser>({

    fullName : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        enum : ['male', 'female'],
        required : true
    },
    profilePic : {
        type : String,
        default : ''
    },
    bio : {
        type : String,
        default : ''
    },
    isFreeze : {
        type : Boolean,
        default : false
    },
    followers : [{
        type : Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }],
    following : [{
        type : Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }]

}, {timestamps : true});


const User = model<IUser>('User', userSchema);

export default User;