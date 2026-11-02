export interface IApiErrorPayload {
  message?: string | string[];
  error?: string;
}

export interface IApiResponse<T> {
  data: T;
}
