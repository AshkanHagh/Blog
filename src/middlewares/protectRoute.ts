import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/types';


const protectRoute = async (req : Request, res : Response, next : NextFunction) => {

    try {
        const token = req.cookies.jwt;

        if(!token) return res.status(400).json({error : 'Unauthorized - No token provided'});

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        const user = await User.findById<IUser>(decoded.userId);

        if(!user) return res.status(401).json({error : 'Invalid token'});

        req.user = user;

        next();

    } catch (error) {

        console.log('error in protectRoute middleware :', error);

        res.status(500).json({error : 'Internal server error middleware'});
    }

}

export default protectRoute;