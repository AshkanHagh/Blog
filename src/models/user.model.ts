import mongoose from 'mongoose';
import { IUser } from '../types/types';

const userSchema = new mongoose.Schema<IUser>({

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
    }

}, {timestamps : true});


const User = mongoose.model<IUser>('User', userSchema);

export default User;