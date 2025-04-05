### PROFILE CONTROLLER (not used)

```js
import { Request, Response } from 'express';
import axios from 'axios';

const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;

export default {

    displayProfile: async (req: Request, res: Response) : Promise<void> => {
    console.log("DEBUG PROFIL CONT start");
      try {
          const {id} = req.params;
          const response = await axios.get(`${apiUsersUrl}/${id}`);
          console.log("DEBUG PROFIL CONT response", response);
          const user = response.data;
          console.log("DEBUG PROFIL CONT user", user);
          if (!user) {
            res.status(404).send('Utilisateur non trouvé');
            return;
          }
          res.render("profil", {user});
        } catch (error: any) {
          const errorMessage : any = error instanceof Error
              ? error.message
              : "Une erreur est survenue lors de la récupération de l'utilisateur";
          console.log(errorMessage)
          return res.status(500).render("profil", {error: errorMessage} );
        }
  },
}
```