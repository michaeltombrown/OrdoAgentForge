import { Request } from 'express';
import { User } from './database.js';

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Request {
  user?: User;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Error response
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}
