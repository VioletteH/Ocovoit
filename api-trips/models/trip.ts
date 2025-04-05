import mongoose from 'mongoose';
import db from './db';

const schema = new mongoose.Schema(
    {
        driver_id: { type: String, required: true },
        departure_id: { type: String, required: true }, 
        destination_id: { type: String, required: true }, 
        date_time: { type: Date, required: true },
        seats_available: { type: Number, required: true },
        luggage_accepted: { type: Boolean, required: true },
    }, 
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const model = db.model('Trip', schema);
export default model;