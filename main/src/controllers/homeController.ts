import { Request, Response } from 'express';
import axios from 'axios';

const apiTripsUrl = process.env.API_TRIPS_SERVICE_URL as string;
const apiStagesUrl = process.env.API_STAGES_SERVICE_URL as string;
const apiUsersUrl = process.env.API_USERS_SERVICE_URL as string;

interface User {
    _id: string;
    firstname: string;
}
  
interface Stage {
    _id: string;
    city: string;
}

interface Trip {
    _id: string;
    driver_id: string;
    departure_id: string;
    destination_id: string;
    date_time: Date;
    seats_available: number;
    luggage_accepted: boolean;
}

interface ModifiedTrip {
    trip_id: string;
    driver: string | null;
    departure_city: string | null;
    destination_city: string | null;
    date_time: Date;
    seats_available: number;
    luggage_accepted: boolean;
}

export default {

    displayHome: async (req: Request, res: Response) => {
        
        try {
            
            const tripsResponse = await axios.get<Trip[]>(apiTripsUrl);
            const trips = tripsResponse.data;

            const usersResponse = await axios.get<User[]>(apiUsersUrl);
            const users = usersResponse.data;

            const stagesResponse = await axios.get<Stage[]>(apiStagesUrl);
            const stages = stagesResponse.data;

            const modifiedTrips = trips.map((trip) => {
                const driver = users.find(user => (user._id === trip.driver_id)); 
                const departure = stages.find(stage => (stage._id === trip.departure_id));
                const destination = stages.find(stage => (stage._id === trip.destination_id));
                
                const date = typeof trips[0].date_time;;
                console.log("DEBUG HOME CONT date", date);

                return {
                    trip_id: trip._id,
                    driver: driver ? driver.firstname : null,
                    departure_city: departure ? departure.city : null,
                    destination_city: destination ? destination.city : null,
                    date_time: trip.date_time,
                    seats_available: trip.seats_available,
                    luggage_accepted: trip.luggage_accepted,
                };
            });

            res.status(200).render("home", {modifiedTrips});
        } catch (error: any) {
            const errorMessage : any = error instanceof Error
                ? error.message
                : "Une erreur est survenue lors de la récupération des voyages";
            console.log(errorMessage)
            return res.status(500).render("home", {error: errorMessage} );
        }
    },
}