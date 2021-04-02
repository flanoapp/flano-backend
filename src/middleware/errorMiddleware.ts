import HttpException from '../exceptions/HttpException';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status === 200 ? 500 : error.status;
    console.log(`[server]: Request failed (${error.status}): ${error.message}`);
    res.status(statusCode)
        .send(`${error.status}: ${error.message}`);
};

export default errorMiddleware;
