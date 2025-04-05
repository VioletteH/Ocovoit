import express, { Request, Response, NextFunction } from 'express';
import routesConfig from './acl';

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req: Request, res: Response, next: NextFunction) => {    
    
    const { method, path } = req.body;
    const { role } = req.headers;
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    const routeAllowedRoles = routesConfig[normalizedPath]?.[method];

    if (!routeAllowedRoles) {
        res.status(404).json({ error: 'Route non définie dans les ACL' });
        return;
    }

    if (!routeAllowedRoles[role as string]) {
        res.status(403).json({ error: 'Accès refusé' });
        return;
    }
    
    res.status(200).json({ accessGranted: true });
});

app.listen(PORT, () => {
    console.log(`Serveur ACL autorisé démarré sur http://localhost:${PORT}`);
});
