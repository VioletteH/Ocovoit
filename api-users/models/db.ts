import mongoose from 'mongoose';
export default mongoose.createConnection(process.env.MONGO_URL as string);
