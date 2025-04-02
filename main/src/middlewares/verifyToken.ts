import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET as string;

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.auth_token;
    const connected_user = req.cookies?.connected_user;
    if (!token) {
        res.status(401).json({ error: "Token non fourni" });
        return;
    }
    const tokenData = jwt.verify(token, jwtSecret) as { role: string };
    res.locals.auth_token = token;
    res.locals.connected_user = connected_user;

    console.log('DEBUG verifyToken token', token);
    console.log('DEBUG verifyToken connected_user', connected_user);
    
    next();
};