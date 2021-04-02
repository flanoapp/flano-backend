import express, { NextFunction, Request, Response } from 'express';

import FlanoObject from '../models/db/object';

const router = express.Router();

const getUniqueCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const details = await FlanoObject.distinct('details.category', { 'details.category': { $ne: '-' } });

        console.log('[server]: Request successful');
        res.status(200).json(details);
    } catch (error) {
        next(error);
    }
};

router.get('/', getUniqueCategories);

export default router;
