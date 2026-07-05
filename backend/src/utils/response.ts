export class ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: any;
  timestamp: string;

  constructor(success: boolean, message: string, data?: T, error?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static error(message: string, error?: any): ApiResponse {
    return new ApiResponse(false, message, undefined, error);
  }
}
