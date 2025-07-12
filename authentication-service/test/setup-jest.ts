import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'; 

let mongoServer: MongoMemoryServer | null = null;;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions); 
}, 100000);

afterAll(async () => {
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }
});