export interface ErrorContext {
  appErrorCode: string;
  description: string;
  metadata?: unknown;
}

export interface ApiSuccessResponse<T> {
  httpStatus: number;
  success: true;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  httpStatus: number;
  success: false;
  data: null;
  error: ErrorContext;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
