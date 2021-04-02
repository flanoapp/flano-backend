import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

const getTranslation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let locale = req.params.locale;
        if(!locale) {
            locale = 'de';
        }
        const translation = require(`../../resources/translations/${locale}.json`)
        res.status(200).json(translation)
    } catch (error) {
        next(error);
    }
}

router.get('/', getTranslation);

export default router;
