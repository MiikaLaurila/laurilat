export interface ServerResponse {
  success: boolean;
  message: string;
  error?: unknown;
  data?: Record<string, unknown>;
}
