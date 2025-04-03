import express, { Express } from 'express';
import path from 'path';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import router from "./src/router/router";
import jwt from 'jsonwebtoken';

const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;
const jwtSecret = process.env.JWT_SECRET as string; 

import { verifyToken } from './src/middlewares/verifyToken';
import { verifyRole } from './src/middlewares/verifyRole';

const app: Express = express();
const PORT: number = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.use(verifyToken);
// app.use(checkAuthorization);

app.use((req, res, next) => {
    res.locals.auth_token = req.cookies?.auth_token;
    console.log('DEBUG INDEX auth_token', req.cookies?.auth_token);

    const token = req.cookies?.auth_token;
    if (token) {
        try {
            const decodedToken: any = jwt.verify(token, jwtSecret);
            res.locals.role_admin = decodedToken.role;
            console.log('DEBUG INDEX role_admin', res.locals.role_admin);
        } catch (error) {
            console.error('Erreur lors de la vérification du token :', error);
            res.locals.role_admin = undefined;
        }
    } else {
        res.locals.role_admin = undefined;
    }

    next();
});

// app.use(verifyToken, verifyRole);

app.use(router);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});