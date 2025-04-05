import { Request, Response } from 'express';
import axios from 'axios';

const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;

export default {

    displayUsers: async (req: Request, res: Response) => {
        try {
            const response = await axios.get(`${apiUsersUrl}`);
            const users = response.data;
            res.render("users", {users});
          } catch (error: any) {
            const errorMessage : any = error instanceof Error
                ? error.message
                : "Une erreur est survenue lors de la récupération des utilisateurs";
            console.log(errorMessage)
            return res.status(500).render("users", {error: errorMessage} );
          }
    },
}