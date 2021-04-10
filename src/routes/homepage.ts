import express, { NextFunction, Request, Response } from 'express';
import path from 'path';

const router = express.Router();

const donate = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect('/#donate');
};

const privacy = async (req: Request, res: Response, next: NextFunction) => {
    res.redirect('/datenschutz_app.html');
};

router.get('/donate', donate);
router.get('/datenschutz_app', privacy);
router.use('/', express.static(path.join(__dirname, '..', '..', 'resources', 'website')));

export default router;
