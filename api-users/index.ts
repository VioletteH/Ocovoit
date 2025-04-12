import express from 'express';
import type { Request, Response } from 'express';
import User from './models/user';

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req: Request, res: Response) => { 
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue" });
    }
});

app.get('/:email', async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });  
        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }
        res.status(200).json(user);  
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
});

app.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstname, lastname, address, zipcode, city, phone, email, password, admin } = req.body;

        if (!firstname || !lastname || !address || !zipcode || !city || !phone || !email || !password || admin === undefined) {
            res.status(400).json({ error: "Tous les champs sont obligatoires" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "Cet utilisateur existe déjà" });
            return;
        }

        const newUser = new User({
            firstname,
            lastname,
            address,
            zipcode,
            city,
            phone,
            email,
            password, 
            admin 
        });

        const createdUser = await newUser.save();
        res.status(201).json(createdUser); 

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la création de l'utilisateur" });
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});