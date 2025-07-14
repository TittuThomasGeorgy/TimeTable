import { Request, Response, NextFunction } from 'express';
import sendApiResponse from '../utils/sendApiResponse';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('🔥 Error caught by error handler:', err);

    sendApiResponse(res, 'INTERNAL SERVER ERROR', {
        data: { error: err.message },
        message: `Oops! Something went wrong! We're working on it!`,
    });
};
