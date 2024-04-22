import { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user : JwtPayload
        }
    }
}

export interface IUser extends Document {
    fullName : string,
    username : string,
    password : string,
    gender : string,
    profilePic? : string,
    bio? : string,
    isFreeze? : boolean
}