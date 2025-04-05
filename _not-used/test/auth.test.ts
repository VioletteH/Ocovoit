import {describe, expect, test} from '@jest/globals';
import axios from 'axios';
import "dotenv/config";
const mongoUrl = process.env.MONGO_URL as string;

describe("Auth API", () => {
    test("/register", async () => {
        const response = await axios.post(`${mongoUrl}/register`, {
            firstname: "John",
            lastname: "Doe",
            address: "123 Main St",
            zipcode: "12345",
            city: "Paris",
            phone: "0123456789",
            email: "johndoe@gmail.com",
            password: "Password123!",
            admin: true 
        });

        expect(response.status).toEqual(201);
        expect(response.data.token).not.toBeNull();
        expect(response.data.user.firstname).toEqual('John');
        expect(response.data.user.lastname).toEqual('Doe');
        expect(response.data.user.address).toEqual('123 Main St');
        expect(response.data.user.zipcode).toEqual('12345');
        expect(response.data.user.city).toEqual('Paris');
        expect(response.data.user.phone).toEqual('0123456789');
        expect(response.data.user.email).toEqual('johndoe@gmail.com');
        expect(response.data.user.password).toEqual('Password123!');
        expect(response.data.user.admin).toEqual(true);
    });

    test("/login", async () => {
        const response = await axios.post(`${mongoUrl}/register`, {
            email: "johndoe@gmail.com",
            password: "Password123!",
        });
       
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.data.user.email).toEqual('johndoe@gmail.com');
        expect(response.data.user.password).toEqual('Password123!');
    });
});