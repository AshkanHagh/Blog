import { JwtPayload } from 'jsonwebtoken';
import { Document, ObjectId } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user : JwtPayload
        }
    }
}

export interface IUser extends Document {
    fullName : string
    username : string
    password : string
    gender : string
    profilePic? : string
    bio? : string
    isFreeze? : boolean
    followers? : string[],
    following? : string[]
}

export interface IPost extends Document {
    title : string
    description : string
    imageUrl? : string
    author : ObjectId
    isPublish : boolean
    likes : Object[]
}

export interface IComment extends Document {
    senderId : ObjectId
    receiverId : ObjectId
    text : string
}