import { NextResponse } from 'next/server';

/**
 * Standard API Response Format
 * Follows company standard with code, status, message, and data
 */

export interface ApiResponse<T = any> {
  code: number;
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: any;
}

/**
 * Success Response Helper
 */
export function successResponse<T>(
  data: T,
  message: string = 'Success',
  code: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      code,
      status: 'success',
      message,
      data,
    },
    { status: code }
  );
}

/**
 * Error Response Helper
 */
export function errorResponse(
  message: string,
  code: number = 500,
  errors?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      code,
      status: 'error',
      message,
      ...(errors && { errors }),
    },
    { status: code }
  );
}

/**
 * Validation Error Response
 */
export function validationErrorResponse(
  errors: any,
  message: string = 'Validation failed'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      code: 422,
      status: 'error',
      message,
      errors,
    },
    { status: 422 }
  );
}
