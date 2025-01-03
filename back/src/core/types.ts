import { type Request } from 'express';

export interface ValidationType {
	constraint: string;
}

export interface SuccessResponse<T> {
	data?: T;
}

export interface ErrorResponse {
	name: string;
	message: string;
	validationErrors?: ValidationType[];
	stack?: string;
	errorCode?: string;
}

export interface HttpConfig {
	headers?: Record<string, string>;
	controller?: AbortController;
}

export interface CustomRequest extends Request {
	userId?: number;
	userEmail?: string;
}
