import { Request, Response } from 'express';
import axios from 'axios';

const authUrl = process.env.AUTHENTICATION_SERVICE_URL as string;

export default {

    displayLogin: (req: Request, res: Response) => {
        res.render('auth/login');
    },

    displayRegister: (req: Request, res: Response) => {
        res.render('auth/register');
    },

    login: async (req: Request, res: Response) => {
        try {
            console.log('DEBUG recuperer le body', req.body);
            const response = await axios.post(authUrl + "/login", req.body); 
            console.log('DEBUG recuperer la response', response);
            const { token, user } = response.data; 
            console.log('DEBUG recuperer la response.data', response.data);
            res.cookie('auth_token', token); 
            res.cookie('connected_user', JSON.stringify(user));
            console.log('Redirecting to home...');
            res.render("user", {user});
        } catch (error: any) {
            console.error('Error during login:', error);
            console.log('Error details:', error.response ? error.response.data : error.message);
            const errorMessage = error.response?.data?.error || 'Une erreur est survenue lors de la connexion'; 
            res.status(401).render('auth/login');
        } 
    },

    register: async (req: Request, res: Response) => {
        try {
            const response = await axios.post(authUrl + "/register", req.body);
            const { token, user } = response.data;
            res.cookie('auth_token', token);
            res.cookie('connected_user', user);
            res.redirect('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Une erreur est survenue lors de l'inscription";
            res.status(400).render('auth/register');
        }
    },

    logout: (req: Request, res: Response) => {
        res.clearCookie('auth_token');
        res.clearCookie('connected_user');
        res.redirect('/');
    },
}