import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.use('/', express.static('resources/website'));

export default router;
