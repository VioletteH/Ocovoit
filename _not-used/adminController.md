### AdminController.ts (not used)

```js
import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const authzUrl = process.env.AUTHORIZATION_SERVICE_URL as string;
const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;
const jwtSecret = process.env.JWT_SECRET as string; 

export default {

    displayUsers: async (req: Request, res: Response) => {
        try {
           
            const token = req.cookies.auth_token; 
        
            if (!token) {
                return res.status(401).render('users', { error: 'Token manquant' });
            }

            const decodedToken: any = jwt.verify(token, jwtSecret); 
            const userRole = decodedToken.role; 
    
            const allowedRoles = { admin: true }; 

            const authResponse = await axios.post(
                authzUrl,
                {
                    method: 'GET',
                    path: '/users',
                    allowedRoles: allowedRoles,
                },
                {
                    headers: { role: userRole }, 
                }
            );

            if (authResponse.data.accessGranted) {
                const response = await axios.get(`${apiUsersUrl}`);
                const users = response.data;
                res.render('users', { users });
            } else {
                return res.status(403).render('users', { error: 'Accès refusé' })
            }

        } catch (error: any) {
            const errorMessage : any = error instanceof Error
                ? error.message
                : "Une erreur est survenue lors de la récupération des utilisateurs";
            console.log(errorMessage)
            return res.status(500).render("users", {error: errorMessage} );
        }
    },

    displayUser: async (req: Request, res: Response) : Promise<void> => {
        try {
            const {email} = req.params;
            const token = req.cookies.auth_token;

            if (!token) {
                return res.status(401).render('user', { error: 'Token manquant' });
            }

            const decodedToken: any = jwt.verify(token, jwtSecret);
            const userRole = decodedToken.role;
            const allowedRoles = { admin: true };

            const authResponse = await axios.post(
                authzUrl,
                {
                    method: 'GET',
                    path: `/users/${email}`,
                    allowedRoles: allowedRoles,
                },
                {
                    headers: { role: userRole },
                }
            );

            if (authResponse.data.accessGranted) {
                const response = await axios.get(`${apiUsersUrl}/users/${email}`);
                const user = response.data;
                if (!user) {
                    res.status(404).send('Utilisateur non trouvé');
                    return;
                }
                res.render('user', { user });
            } else {
                res.status(403).render('user', { error: 'Accès refusé' });
            }

        } catch (error: any) {
            const errorMessage : any = error instanceof Error
                ? error.message
                : "Une erreur est survenue lors de la récupération de l'utilisateur";
            console.log(errorMessage)
            return res.status(500).render("user", {error: errorMessage} );
        }
    },
}
```