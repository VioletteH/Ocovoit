import express, { Request, Response } from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const PORT = 3000;
const jwtSecret = process.env.JWT_SECRET as string;
const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function createToken(data: { id: string; email: string, admin: boolean }) {
    const role = data.admin ? "ADMIN" : "USER";
    return jwt.sign(
        {...data, role: role},
        jwtSecret,
        { expiresIn: '1h' }
    );
}

app.post('/login', async (req: Request, res: Response) => {
    const errorConnexion = "Connexion échouée, veuillez réessayer.";
    try {
        console.log('DEBUG AUTH jwtSecret', jwtSecret);
        console.log('DEBUG AUTH req.body', req.body);
        console.log('DEBUG AUTH req.body email', req.body.email);
        const { email, password } = req.body; 
        if (!email || !password) {
            throw new Error("Tous les champs sont obligatoires");
        }

        const response = await axios.get(`${apiUsersUrl}/${email}`); 
        console.log('DEBUG AUTH response', response);

        const user = response.data;
        console.log('DEBUG AUTH user', user);
        if (!user) {
            throw new Error(errorConnexion);
        }
        console.log('DEBUG AUTH: Before bcrypt.compareSync'); // ok
        const match = bcrypt.compareSync(password, user.password);
        console.log('DEBUG AUTH match', match); // false
        if (!match) {
            throw new Error(errorConnexion);
        }

        console.log('DEBUG AUTH: Before createToken');
        const token = createToken({ id: user._id, email: user.email, admin: user.admin })
        console.log('DEBUG AUTH token', token);
    
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
            const response = await axios.get(`${apiUsersUrl}/${email}`);
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

        const token = createToken({ id: createdUser._id, email: createdUser.email, admin: createdUser.admin });
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