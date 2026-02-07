import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ErrorResponse } from '../../types/requests.js';

/**
 * Validation Middleware Factory
 *
 * Creates middleware that validates request data using Zod schemas
 * Can validate body, query, or params
 */
export const validate =
  (schema: ZodSchema) =>
  async (
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error during validation',
      });
      return;
    }
  };

/**
 * Validate request body only
 */
export const validateBody =
  (schema: ZodSchema) =>
  async (
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error during validation',
      });
      return;
    }
  };

/**
 * Validate request params only
 */
export const validateParams =
  (schema: ZodSchema) =>
  async (
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error during validation',
      });
      return;
    }
  };

export default validate;
