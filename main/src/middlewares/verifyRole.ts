import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET as string;

export const verifyRole = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.auth_token;

    if (!token) {
        res.status(401).json({ error: 'Token requis' });
        return;
    }

    try {
        const decodedToken: any = jwt.verify(token, jwtSecret);

        res.locals.role_admin = decodedToken.role;

        // if (decodedToken.role === 'ADMIN') {
        //     next();
        // } else {
        //     res.status(403).json({ error: 'Accès refusé: Rôle ADMIN requis' });
        // }
    } catch (error) {
        res.status(401).json({ error: 'Erreur lors de la vérification de l\'autorisation' });
    }
};


