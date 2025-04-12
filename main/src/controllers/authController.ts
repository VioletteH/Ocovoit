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
            const response = await axios.post(authUrl + "/login", req.body); 
            const { token, user } = response.data; 
            res.cookie('auth_token', token); 
            res.cookie('connected_user', JSON.stringify(user));
            res.redirect('/');
        } catch (error: any) {
            // console.error("AUTH CONT Message d'erreur :", error.message); // Request failed with status code 401
            // console.log("AUTH CONT Nom de l'erreur :", error.name); // AxiosError
            // console.log('AUTH CONT Error:', error); // AxiosError: Request failed with status code 401 + objet complet
            // console.log('AUTH CONT Error.response:', error.response); // objet complet
            // console.log('AUTH CONT Error.response.data:', error.response.data);
            // console.log('AUTH CONT Error.response.data:', error.response.data); // Request failed with status code 404
            // const errorMessage = error.response?.data?.error || "Une erreur inconnue s'est produite";
            // res.status(401).render('auth/login', { error: errorMessage });
            res.status(401).render('auth/login', { error: error.response.data.error });
        } 
    },

    // register: async (req: Request, res: Response) => {
    //     try {
    //         const response = await axios.post(authUrl + "/register", req.body);
    //         const { token, user } = response.data;
    //         res.cookie('auth_token', token);
    //         res.cookie('connected_user', user);
    //         res.redirect('/');
    //     } catch (error: any) {
    //         // const errorMessage = error.response?.data?.error || "Une erreur est survenue lors de l'inscription";
    //         console.log('AUTH CONT Error.response:', error.response);
    //         console.log('AUTH CONT Error.response.data:', error.response.data);
    //         console.log('AUTH CONT Error.response.data.error:', error.response.data.error);
    //         res.status(400).render('auth/register', { error: error.response.data.error });
    //     }
    // },

    // dans mon controller auth
    register: async (req: Request, res: Response) => {
        try {
            const response = await axios.post(authUrl + "/register", req.body);
            const { token, user } = response.data;
            res.cookie('auth_token', token);
            res.cookie('connected_user', user);
            res.redirect('/');
        } catch (error: any) {
            console.log('AUTH CONT Error.response:', error.response);
            console.log('AUTH CONT Error.response.data:', error.response?.data);
            console.log('AUTH CONT Error.response.data.error:', error.response?.data?.error);

            let errorMessage = "Une erreur est survenue lors de l'inscription.";
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            res.status(error.response?.status || 500).render('auth/register', { error: errorMessage });
        }
    },
    logout: (req: Request, res: Response) => {
        res.clearCookie('auth_token');
        res.clearCookie('connected_user');
        res.redirect('/');
    },
}