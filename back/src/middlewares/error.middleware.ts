import { type Response, type NextFunction, type Request } from 'express';
import { AppError } from '../core/custom.error';
import { type ErrorResponse } from '../core/types';
import { HttpCode } from '../core/constants';

export class ErrorMiddleware {
	public static handleError = (error: unknown, _: Request, res: Response<ErrorResponse>, next: NextFunction): void => {
		if (error instanceof AppError) {
			const { message, name, validationErrors, errorCode } = error;
			const statusCode = error.statusCode || HttpCode.INTERNAL_SERVER_ERROR;
			res.statusCode = statusCode;
			res.json({ name, message, validationErrors, errorCode });
		} else {
			const name = 'InternalServerError';
			const message = 'An internal server error occurred';
			const statusCode = HttpCode.INTERNAL_SERVER_ERROR;
			res.statusCode = statusCode;
			res.json({ name, message });
		}
		next();
	};
}
