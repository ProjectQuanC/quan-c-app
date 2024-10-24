import express from 'express';
import CustomError from '../utils/error.utils';
import { JsonResponse } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

const customErrorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errorId = uuidv4();
    console.log(`[-] Error ID: ${errorId}`);
    console.log(`${err.message}\n`);
    if (err instanceof CustomError) {
        let response: JsonResponse = {
            success: false,
            message: err.message,
        }
        return res.status(err.status).json(response);
    }
    let jsonResponse: JsonResponse = {
        success: false,
        message: `[Internal Server Error] Ask for help to the administrator and provide the following id: ${errorId}`,
    };
    return res.status(500).json(jsonResponse);
}

export default customErrorHandler;