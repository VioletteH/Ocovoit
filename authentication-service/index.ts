import express, { Request, Response } from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Joi from 'joi';

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
    const errorMessage = "L'email est inconnu ou le mot de passe est erroné."; 
    try {
        const { email, password } = req.body; 

        // Vérification des champs requis
        if (!email || !password) {
            throw new Error();
        }

        // Vérification si l'email est existant
        const response = await axios.get(`${apiUsersUrl}/${email}`); 
        const user = response.data;
        if (!user) {
            throw new Error();
        }

        // Vérification de la correspondance entre l'email et le mot de passe
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            throw new Error();
        }

        const token = createToken({ id: user._id, email: user.email, admin: user.admin })
        res.status(201).json({ token, user });
    } catch (error: any) {
        console.log("AUTH SERVICE erreur :", errorMessage); 
        res.status(401).json({ error: errorMessage });
    }
});

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, address, zipcode, city, phone, email, password, admin } = req.body;

        // Vérification des champs requis et des formats (notamment email)
        const schema = Joi.object({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            address: Joi.string().required(),
            zipcode: Joi.string().required(),
            city: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).required().messages({
                'string.email': 'Merci de renseigner un email valide.',
              }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
                'string.pattern.base': 'Le mot de passe doit contenir min 3 caractères.',
              }),
            admin: Joi.boolean().required(),
        });
        await schema.validateAsync(req.body);

        // Vérification avec un email déjà utilisé
        // sans try catch > pas de cookies
        try {
            const user = await axios.get(`${apiUsersUrl}/${email}`);
            console.log("Réponse de l'API pour vérification de l'email :", user.data);
            if (user.data) {
                res.status(409).json({ error: "Cet email est déjà utilisé." }); 
                return;
            }
        } catch (error: any) {
                console.log("AUTH SERVICE erreur lors de la vérification de l'email :", error.message);
                res.status(500).json({ error: "Erreur lors de la vérification de l'email." }); 
                return;
        };

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Envoi de la requête POST à l'API
        const responsePost = await axios.post(apiUsersUrl, { firstname, lastname, address, zipcode, city, phone, email, password : hashedPassword, admin });
        const createdUser = responsePost.data;

        if (!createdUser) {
            res.status(500).json({ error: "Une erreur est survenue lors de l'inscription"}); 
            return;
        }

        // Création du token
        const token = createToken({ id: createdUser._id, email: createdUser.email, admin: createdUser.admin });
        res.status(201).json({ token, user: createdUser });

    } catch (error: any) {
        console.log("DEBUG AUTH register error" , error);
        console.log("DEBUG AUTH register error.message" , error.message);
        if (error.isJoi) {
            res.status(400).json({ error: error.details[0].message });
        } else {
            res.status(500).json({ error: "Une erreur inattendue s'est produite lors de l'inscription." }); // ou 401
        }
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});