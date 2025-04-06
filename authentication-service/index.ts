import express, { Request, Response } from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Joi from 'joi';
import passwordValidator from "password-validator";  

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
    try {
        const { email, password } = req.body; 

        // Vérification des champs requis
        if (!email || !password) {
            throw new Error("AUTH SERVICE Tous les champs sont obligatoires");
        }

        // Vérification si l'email est existant
        const response = await axios.get(`${apiUsersUrl}/${email}`); 
        const user = response.data;
        if (!user) {
            throw new Error("AUTH SERVICE Cet email n'existe pas");
        }

        // Vérification de la correspondance entre l'email et le mot de passe
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
            throw new Error("AUTH SERVICE L'email et le mot de passe ne correspondent pas");
        }

        const token = createToken({ id: user._id, email: user.email, admin: user.admin })
        res.status(201).json({ token, user });
    } catch (error: any) {
        console.log("AUTH SERVICE Message d'erreur :", error.message); // Affiche le message d'erreur
        console.log("AUTH SERVICE Nom de l'erreur :", error.name); // Affiche le nom de l'erreur
        res.status(401).json({ error: error.message });
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
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).required(),
            password: Joi.string().required(),
            admin: Joi.boolean().required(),
        });
        await schema.validateAsync(req.body);

        // Vérification de la robustesse du mot de passe
        const schemaPassword = new passwordValidator();
        schemaPassword
            .is().min(8, "Votre mdp doit avoir min 8 caractères")
            .has().uppercase(1, "Votre mdp doit avoir min 1 majuscule")
            .has().symbols(1, "Votre mdp doit avoir min 1 caractère spécial")
            .has().digits(1, "Votre mdp doit avoir min 1 chiffre");
        const passwordErrors: { [key: string]: string[] } = {};
        const passwordValidationResult = schemaPassword.validate(password, { details: true }) as string[];
        if (passwordValidationResult.length > 0) {
            passwordErrors.password = passwordValidationResult; 
        }
    
        // Verification avec un email déjà utilisé
        try {
            const user = await axios.get(`${apiUsersUrl}/${email}`);
            console.log("DEBUG AUTH register user" , user);
            const userData = user.data;
            console.log("DEBUG AUTH register userData" , userData);
            if (userData) {
                throw new Error("Cet email est déjà utilisé.");
            }
        } catch (error: any) {
            console.log(error);

        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Envoi de la requête POST à l'API
        const responsePost = await axios.post(apiUsersUrl, { firstname, lastname, address, zipcode, city, phone, email, password : hashedPassword, admin });
        const createdUser = responsePost.data;

        if (!createdUser) {
            throw new Error("Une erreur est survenue lors de l'inscription");
        }

        // Création du token
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