import express, { NextFunction, Request, Response } from 'express';

import FlanoTour from '../models/db/tour';
import { DBToTourAPIMany, DBToTourAPIOne } from '../models/api/tour';
import { getTourById_helper } from './helpers';

const router = express.Router();

const getAllTours = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tours = await FlanoTour.find();

        const mappedTours = DBToTourAPIMany(tours);

        console.log('[server]: Request successful');
        res.status(200).json(mappedTours);
    } catch (error) {
        next(error);

    }
};

const getTourById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tour = await getTourById_helper(req.params.id, next);

        const mappedTour = DBToTourAPIOne(tour);

        console.log('[server]: Request successful');
        res.status(200).json(mappedTour);

    } catch (error) {
        next(error);

    }
};

router.get('/', getAllTours);
router.get('/:id', getTourById);

export default router;
