import {describe, expect, test} from '@jest/globals';
import axios from 'axios';
import "dotenv/config";
const apiAuthUrl = process.env.AUTHENTICATION_SERVICE_URL as string;
const staticApiUrl = "http://localhost:3000";

describe("Auth API", () => {
    test("/register", async () => {
        const response = await axios.post(`http://ocovoit-auth:3000`, {
            firstname: "Richard",
            lastname: "Given",
            address: "112 av de la République",
            zipcode: "75011",
            city: "Paris",
            phone: "07678765",
            email: "richard@gmail.com",
            password: "Password123!",
            admin: true 
        });

        expect(response.status).toEqual(201);
        expect(response.data.token).not.toBeNull();
        expect(response.data.user.firstname).toEqual('Richard');
        expect(response.data.user.lastname).toEqual('Given');
        expect(response.data.user.address).toEqual('112 av de la République');
        expect(response.data.user.zipcode).toEqual('75011');
        expect(response.data.user.city).toEqual('Paris');
        expect(response.data.user.phone).toEqual('07678765');
        expect(response.data.user.email).toEqual('richard@gmail.com');
        expect(response.data.user.admin).toEqual(true);
    });

    test("/login", async () => {
        const response = await axios.post(`http://ocovoit-auth:3000`, {
            email: "admin@mailinator.com",
            password: "admin!",
        });
       
        expect(response.status).toEqual(201);
        expect(response.data.user.email).toEqual('admin@mailinator.com');
    });
});