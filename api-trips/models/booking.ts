import mongoose from 'mongoose';
import db from './db';

const schema = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        trip_id: { type: String, required: true }, 
        seats_booked: { type: Number, default: 1, required: true },
        booking_status: { type: String, enum: ['confirmé', 'en attente', 'annulé'], default: 'en attente', required: true },
    }, 
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const model = db.model('Booking', schema);
export default model;