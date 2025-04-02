import express, { Express } from 'express';
import path from 'path';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import router from "./src/router/router";
import jwt from 'jsonwebtoken';

const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;
const jwtSecret = process.env.JWT_SECRET as string; 

// import { verifyToken } from './src/middlewares/verifyToken';
// import { checkAuthorization } from './src/middlewares/checkautorization';

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
    // res.locals.connected_user = req.cookies?.connected_user; // mieux de pas mettre en cookies 

    // const decodedToken: any = jwt.verify(token, jwtSecret); //
    // const userRole = decodedToken.role; 
    // const response = await axios.get(`${apiUsersUrl}/${decodedToken.email}`);
    // const user = response.data;
    // res.locals.role_admin = decoder le token pour récupérer le role 
    next();
});

app.use(router);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});