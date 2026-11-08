export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  token?: string | null;
  body?: unknown;
  onUnauthorized?: () => void | Promise<void>;
};

export type AuthenticatedRequestOptions = Omit<
  ApiRequestOptions,
  "token" | "onUnauthorized"
>;

export type ApiRequest = <TResponse>(
  path: string,
  options?: AuthenticatedRequestOptions,
) => Promise<TResponse>;
