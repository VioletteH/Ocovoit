import mongoose from 'mongoose';
import db from '../api-trips/models/db';

const stageSchema = new mongoose.Schema(
    {
        address: { type: String, required: true },
        zipcode: { type: String, required: true },
        city: { type: String, required: true },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const Stage = db.model('Stage', stageSchema);
export default Stage;