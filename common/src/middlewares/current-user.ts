import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';


interface UserPayload {
    id: string;
    email: string;
}

// Adding in the currentUser property to the req object
declare global {
    namespace Express{
        interface Request{
            currentUser?: UserPayload;
        }
    }
}

// This middleware sets the current user to the req object if it is there
// We always call the currentUser middleware before checking if the 
// user is authenticated
export const currentUser = (
    req:Request, 
    res:Response, 
    next: NextFunction
) => {
    if(!req.session?.jwt) return next();

    try{
        const payload = (jwt.verify(req.session.jwt, process.env.JWT_KEY!)) as UserPayload;
        req.currentUser = payload;
    }catch(err){
    }
    next();
}