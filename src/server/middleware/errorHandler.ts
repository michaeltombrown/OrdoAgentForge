import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../../types/requests.js';

/**
 * Global Error Handler Middleware
 *
 * Catches all errors and returns consistent error responses
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  console.error('Error:', err);

  // Default to 500 Internal Server Error
  const statusCode = 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    message: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
