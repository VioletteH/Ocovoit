import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import axios from 'axios';

const jwtSecret = process.env.JWT_SECRET as string;
const authzUrl = process.env.AUTHORIZATION_SERVICE_URL as string;

export const checkRouteAuthz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.auth_token;

    if (!token) {
        res.status(401).json({ error: 'Token requis' });
        return;
    }

    try {
        const decodedToken: any = jwt.verify(token, jwtSecret);
        const userRole = decodedToken.role;
        const allowedRoles = { admin: true }; 

        const authResponse = await axios.post(
            authzUrl,
            {
                method: req.method, 
                path: req.path,
                allowedRoles: allowedRoles,
            },
            {
                headers: { role: userRole },
            }
        );

        if (authResponse.status === 200 && authResponse.data.accessGranted) {
            next();
        } else {
            res.status(403).json({ error: 'Accès refusé' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Erreur lors de la vérification de l\'autorisation' });
    }
};