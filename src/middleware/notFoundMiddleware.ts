import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const error = new HttpException(404, `Not Found`);
    res.status(404);
    next(error);
};

export default notFoundMiddleware;
