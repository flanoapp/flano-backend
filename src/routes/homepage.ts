import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

const homePage = ((req: Request, res: Response, next: NextFunction) => {
    res.send('Coming soon!');
});

router.get('/', homePage);
router.get('/about', homePage);
router.get('/donate', homePage);
export default router;
