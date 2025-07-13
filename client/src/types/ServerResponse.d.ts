
export interface ServerResponse<T> {
  success?: boolean;
  error?: string;
  message?: string;
  data: T;
}
