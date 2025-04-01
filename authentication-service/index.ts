import express, { Request, Response } from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const PORT = 3000;
const jwtSecret = process.env.JWT_SECRET as string; //
const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function createToken(data: { id: string; email: string }) {
    return jwt.sign(
        data,
        jwtSecret,
        { expiresIn: '1h' }
    );
}

app.post('/login', async (req: Request, res: Response) => {
    const errorConnexion = "Connexion échouée, veuillez réessayer.";
    try {
        const { email, password } = req.body; 
        console.log("recup req.body", req.body);
        if (!email || !password) {
            throw new Error("Tous les champs sont obligatoires");
        }
        console.log(`Making request to: ${apiUsersUrl}/users/${email}`);
        const response = await axios.get(`${apiUsersUrl}/users/${email}`); 
        console.log("recup response", response);
        const user = response.data;
        console.log('Login attempt for:', user);
        if (!user) {
            throw new Error(errorConnexion);
        }

        const match = bcrypt.compareSync(password, user.password);
        console.log('Password match result:', match);
        if (!match) {
            throw new Error(errorConnexion);
        }

        const token = createToken({ id: user._id, email })
        res.status(201).json({ token, user });

    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: errorConnexion });
        }
    }
});

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, address, zipcode, city, phone, email, password, admin } = req.body;
        if (!firstname || !lastname || !address || !zipcode || !city || !phone || !email || !password || !admin) {
            throw new Error("Tous les champs sont obligatoires");
        }

        try {
            const response = await axios.get(`${apiUsersUrl}/users/${email}`);
            if (response.data) {
                throw new Error("Cet utilisateur existe déjà");
            }
        } catch (error) {
            console.log(error)
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const responsePost = await axios.post(apiUsersUrl, { firstname, lastname, address, zipcode, city, phone, email, password : hashedPassword, admin });
        const createdUser = responsePost.data;

        if (!createdUser) {
            throw new Error("Une erreur est survenue lors de l'inscription");
        }

        const token = createToken({ id: createdUser._id, email });
        res.status(201).json({ token, user: createdUser });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur est survenue" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});