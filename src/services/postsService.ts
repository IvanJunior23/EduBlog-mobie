import type { IApiResponse } from "../interfaces/IApi";
import type { IPost } from "../interfaces/IPost";
import type {
  IPostDiscipline,
  IPostSearchParams,
  IPostsRequest,
} from "../interfaces/IPostsService";

export async function getPosts(
  request: IPostsRequest,
  signal?: AbortSignal,
): Promise<IPost[]> {
  const response = await request<IApiResponse<IPost[]>>("/posts", {
    method: "GET",
    signal,
  });

  return response.data;
}

export async function searchPosts(
  request: IPostsRequest,
  filters: IPostSearchParams,
  signal?: AbortSignal,
): Promise<IPost[]> {
  const params = new URLSearchParams();

  if (filters.query?.trim()) params.set("q", filters.query.trim());
  if (filters.discipline) params.set("discipline", filters.discipline);
  if (filters.author) params.set("author", filters.author);

  if (!params.size) return getPosts(request, signal);

  const response = await request<IApiResponse<IPost[]>>(
    `/posts/search?${params.toString()}`,
    { method: "GET", signal },
  );

  return response.data;
}

export async function getPostById(
  request: IPostsRequest,
  id: string,
  signal?: AbortSignal,
): Promise<IPost> {
  const response = await request<IApiResponse<IPost>>(
    `/posts/${encodeURIComponent(id)}`,
    { method: "GET", signal },
  );

  return response.data;
}

export async function getPostDisciplines(
  request: IPostsRequest,
  signal?: AbortSignal,
): Promise<IPostDiscipline[]> {
  const response = await request<IApiResponse<IPostDiscipline[]>>(
    "/catalog/disciplines",
    { method: "GET", signal },
  );

  return response.data
    .filter((discipline) => discipline.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getAllPosts(request: IPostsRequest): Promise<IPost[]> {
  const response = await request<IApiResponse<IPost[]>>("/posts/all", {
    method: "GET",
  });

  return response.data;
}
