import express, { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import router from "./src/router/router";

const app: Express = express();
const PORT: number = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use((req, res, next) => {
    res.locals.auth_token = req.cookies?.auth_token;
    res.locals.connected_user = req.cookies?.connected_user;
    next();
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});