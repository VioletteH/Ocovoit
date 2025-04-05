import express from 'express';
import type { Request, Response } from 'express';
import Trip from './models/trip';

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req: Request, res: Response) => { 
    try {
        const trips = await Trip.find()
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
        res.status(200).json(tripsData);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue" });
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});