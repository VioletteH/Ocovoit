import { Request, Response } from 'express';

export default {

    displayHome: (req: Request, res: Response) => {
        res.render('home');
    },
}