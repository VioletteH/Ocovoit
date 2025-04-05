import mongoose from 'mongoose';
import db from './db';

const schema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        rating: { type: Number, required: true }, 
        user_id: { type: String, required: true }, 
        trip_id: { type: String, required: true },
    }, 
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const model = db.model('Review', schema);
export default model;