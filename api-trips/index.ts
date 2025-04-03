import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import Trip from './models/trip';

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req: Request, res: Response) => { 
    try {
        console.log("DEBUG API TRIPS debut");
        const trips = await Trip.find()

        console.log("DEBUG API TRIPS trips", trips);
        const tripsData = trips.map(trip => {
            return {
                _id: trip._id,
                driver_id: trip.driver_id,
                departure_id: trip.departure_id,
                destination_id: trip.destination_id,
                date_time: trip.date_time,
                seats_available: trip.seats_available,
                luggage_accepted: trip.luggage_accepted,
            };
        });

        console.log("DEBUG API TRIPS tripsData", tripsData);
        res.status(200).json(tripsData);

        // Récupérer les données utilisateur pour chaque trajet
        // const tripsWithUsers = await Promise.all(
        //     trips.map(async (trip) => {
        //         if (trip.driver_id) {
        //             try {
        //                 const userResponse = await axios.get(
        //                     `${apiUsersUrl}/${trip.driver_id}`
        //                 );
        //                 return { ...trip.toObject(), driver: userResponse.data };
        //             } catch (userError) {
        //                 console.error(
        //                     `Erreur lors de la récupération de l'utilisateur ${trip.driver_id}:`,
        //                     userError
        //                 );
        //                 return { ...trip.toObject(), driver: null }; // Gérer l'erreur
        //             }
        //         } else {
        //             return { ...trip.toObject(), driver: null };
        //         }
        //     })
        // );
        // res.status(200).json(tripsWithUsers);

        
        // const response = await axios.get(`${apiUsersUrl}`); 
        // const users = response.data;
        // const trips = await Trip.find()
        //     .populate('driver')
        //     .populate('departure')
        //     .populate('destination');
        // console.log("DEBUG API-TRIPS trips", trips);
        // res.status(200).json(trips);

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue" });
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});