import { Request, Response, NextFunction } from 'express';
import sendApiResponse from '../utils/sendApiResponse';
import colors from 'colors';

export const notFound = (
    req: Request,
    res: Response,
) => {
    console.log('Received an error event!'.bgRed, new Error(`404 Found for ${req.url}`));
    sendApiResponse(res, 'NOT FOUND', {
        error: '404 Not Found (REST API Endpoint not implemented)',
        message: 'Oops! Something went wrong! We\'re working on it!',
    });
};

