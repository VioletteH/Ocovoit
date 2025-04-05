import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'; 

let mongoServer: MongoMemoryServer | null = null;;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions); // Cast pour éviter les erreurs de typage
}, 100000);

afterAll(async () => {
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }
});