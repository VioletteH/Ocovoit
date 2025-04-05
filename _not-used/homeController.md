### DEBUG

Exemples de console log et de vérification de type

```js
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
            console.log("DEBUG MAIN HOME trips", trips);

            const usersResponse = await axios.get<User[]>(apiUsersUrl);
            const users = usersResponse.data;
            console.log("DEBUG MAIN HOME users", users);
            const userIdType = typeof users[0]._id;
            console.log("DEBUG MAIN HOME userIdType", userIdType);

            const stagesResponse = await axios.get<Stage[]>(apiStagesUrl);
            const stages = stagesResponse.data;
            console.log("DEBUG MAIN HOME stages", stages);
            const stageIdType = typeof stages[0]._id;
            console.log("DEBUG MAIN HOME stageIdType", stageIdType);

            const TripDriverIdType = typeof trips[0].driver_id;
            console.log("DEBUG MAIN HOME TripDriverIdType", TripDriverIdType);
            const TripDepartureIdType = typeof trips[0].departure_id;
            console.log("DEBUG MAIN HOME TripDepartureIdType", TripDepartureIdType);
            const TripDestinationIdType = typeof trips[0].destination_id;
            console.log("DEBUG MAIN HOME TripDestinationIdType", TripDestinationIdType);

            const modifiedTrips = trips.map((trip) => {
                console.log("DEBUG MAIN HOME trip", trip);
                const driver = users.find(user => (user._id === trip.driver_id)); 
                console.log("DEBUG MAIN HOME driver", driver);
                const departure = stages.find(stage => (stage._id === trip.departure_id));
                console.log("DEBUG MAIN HOME departure", departure);
                const destination = stages.find(stage => (stage._id === trip.destination_id));
                console.log("DEBUG MAIN HOME destination", destination);

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

            console.log("DEBUG MAIN HOME modifiedTrips", modifiedTrips);

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
```