import mongoose from 'mongoose';
import db from './db';

const schema = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        trip_id: { type: String, required: true }, 
    }, 
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const model = db.model('Passenger', schema);
export default model;