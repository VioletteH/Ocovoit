import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import User from './models/user';
import db from './models/db';
import bcrypt from 'bcrypt';

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes pour récupérer tous les utilisateurs de la DB
app.get('/', async (req: Request, res: Response) => { 
    try {
        const users = await User.find();
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue" });
    }
});

app.get('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });  // Recherche un utilisateur par email
        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }
        res.status(200).json(user);  // Renvoyer l'utilisateur en JSON
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
});

app.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstname, lastname, address, zipcode, city, phone, email, password, admin } = req.body;

        // Vérification si tous les champs sont bien présents
        if (!firstname || !lastname || !address || !zipcode || !city || !phone || !email || !password || admin === undefined) {
            res.status(400).json({ error: "Tous les champs sont obligatoires" });
            return;
        }

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "Cet utilisateur existe déjà" });
            return;
        }

        // Création du nouvel utilisateur
        const newUser = new User({
            firstname,
            lastname,
            address,
            zipcode,
            city,
            phone,
            email,
            password,  // Assurez-vous que le mot de passe est déjà haché (le hachage doit être effectué dans le microservice d'authentification)
            admin: admin === 'true'  // Assurez-vous que admin est un booléen
        });

        const createdUser = await newUser.save();
        res.status(201).json(createdUser);  // Renvoyer l'utilisateur créé dans la réponse

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la création de l'utilisateur" });
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});