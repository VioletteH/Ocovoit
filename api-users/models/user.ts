import mongoose from 'mongoose';
import db from './db';

const schema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        address: { type: String, required: true },
        zipcode: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        admin: {type: Boolean, required: true}
    }, 
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const model = db.model('User', schema);
export default model;