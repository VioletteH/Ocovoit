import { Request, Response } from 'express';
import axios from 'axios';

const apiTripsUrl = process.env.API_TRIPS_SERVICE_URL as string;

export default {

    displayHome: async (req: Request, res: Response) => {
        try {
            const response = await axios.get(`${apiTripsUrl}`);
            const trips = response.data;
            console.log("DEBUG HOME trips", trips);
            res.render("home", {trips});
        } catch (error: any) {
            const errorMessage : any = error instanceof Error
                ? error.message
                : "Une erreur est survenue lors de la récupération des voyages";
            console.log(errorMessage)
            return res.status(500).render("home", {error: errorMessage} );
        }
    },
}