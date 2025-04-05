import express from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Stage from './models/stage';

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req: Request, res: Response) => { 
    try {
        const stages = await Stage.find()

        const stagesData = stages.map(stage => {
            return {
                _id: stage._id,
                address: stage.address,
                zipcode: stage.zipcode,
                city: stage.city,
            };
        });

        res.status(200).json(stagesData);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue" });
    }
});

app.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const objectId = new mongoose.Types.ObjectId(id);
        const stage = await Stage.findOne({ _id: objectId });

        if (!stage) {
            res.status(404).json({ error: 'Etape non trouvée' });
            return;
        };

        res.status(200).json(stage);  
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue' });
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});