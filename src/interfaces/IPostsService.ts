export interface IPostsRequest {
  <T>(
    path: string,
    options?: {
      method?: string;
      signal?: AbortSignal;
      body?: unknown;
    },
  ): Promise<T>;
}

export interface IPostSearchParams {
  query?: string;
  discipline?: string;
  author?: string;
}

export interface IPostDiscipline {
  _id: string;
  label: string;
  order?: number;
  isActive?: boolean;
}
