import express, { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import router from "./src/router/router";
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET as string; 

const app: Express = express();
const PORT: number = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.locals.auth_token = req.cookies?.auth_token;
    const token = req.cookies?.auth_token;
    if (token) {
        try {
            const decodedToken: any = jwt.verify(token, jwtSecret);
            res.locals.role_admin = decodedToken.role;
        } catch (error) {
            console.error('Erreur lors de la vérification du token :', error);
            res.locals.role_admin = undefined;
        }
    } else {
        res.locals.role_admin = undefined;
    }
    next();
});

app.use(router);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});