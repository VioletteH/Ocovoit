import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import routesConfig from './acl';

const PORT = 3000;
const app = express();

const jwtSecret = process.env.JWT_SECRET as string;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

interface JWTUser extends JwtPayload {
    id: string;
    role: number;
    email: string;
}

const checkAuthorization = (req: Request, res: Response, next: Function):void => {
    const { method, path } = req;
    
    // Vérifie si la route est dans la configuration ACL
    const allowedRoles = routesConfig[path]?.[method];
    if (!allowedRoles) {
        return next();  // Pas de restrictions, accès autorisé
    }

    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ error: 'Authentification requise' });
        return;
    }

    try {
        // Vérification du token JWT
        const tokenData = jwt.verify(token, jwtSecret) as { role: string };

        // Vérifier si le rôle de l'utilisateur est autorisé
        const userRole = tokenData.role;

        // Si le rôle de l'utilisateur est autorisé à accéder à la route
        if (!allowedRoles[userRole]) {
            res.status(403).json({ error: 'Accès refusé' });
            return;
        }

        // Si tout est bon, passer à la route suivante
        next();
    } catch (error: any) {
        const errorMessage = error.name === 'TokenExpiredError' ? 'Token expiré' : error.message;
        res.status(401).json({ error: errorMessage });
        return;
    }
};

app.listen(PORT, () => {
    console.log(`Serveur ACL autorisé démarré sur http://localhost:${PORT}`);
});

export default checkAuthorization;