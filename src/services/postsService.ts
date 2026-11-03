import type { IApiResponse } from "@/interfaces/IApi";
import type { IDiscipline } from "@/interfaces/IDiscipline";
import type { IPost } from "@/interfaces/IPost";
import type { IPostStatus } from "@/interfaces/IPostStatus";
import type { IPostValues } from "@/interfaces/IPostValues";
import type {
  IPostDiscipline,
  IPostSearchParams,
  IPostsRequest,
} from "@/interfaces/IPostsService";

type IPostApi = IPost & {
  serie?: string | null;
  semestre?: string | null;
};

function normalizePostFromApi(post: IPostApi): IPost {
  const normalizedSeries = post.series ?? post.serie ?? null;
  const normalizedSemester = post.semester ?? post.semestre ?? null;
  const changed =
    normalizedSeries !== post.series || normalizedSemester !== post.semester;

  if (!changed) {
    return post;
  }

  return { ...post, series: normalizedSeries, semester: normalizedSemester };
}

export async function getPosts(
  request: IPostsRequest,
  signal?: AbortSignal,
): Promise<IPost[]> {
  const response = await request<IApiResponse<IPostApi[]>>("/posts", {
    method: "GET",
    signal,
  });

  return response.data.map(normalizePostFromApi);
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

  const response = await request<IApiResponse<IPostApi[]>>(
    `/posts/search?${params.toString()}`,
    { method: "GET", signal },
  );

  return response.data.map(normalizePostFromApi);
}

export async function getPostById(
  request: IPostsRequest,
  id: string,
  signal?: AbortSignal,
): Promise<IPost> {
  const response = await request<IApiResponse<IPostApi>>(
    `/posts/${encodeURIComponent(id)}`,
    { method: "GET", signal },
  );

  return normalizePostFromApi(response.data);
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
  const response = await request<IApiResponse<IPostApi[]>>("/posts/all", {
    method: "GET",
  });

  return response.data.map(normalizePostFromApi);
}

export async function getDisciplines(
  request: IPostsRequest,
  signal?: AbortSignal,
): Promise<IDiscipline[]> {
  const disciplines = await getPostDisciplines(request, signal);

  return disciplines.map((discipline) => ({
    _id: discipline._id,
    label: discipline.label,
    order: discipline.order ?? 0,
    isActive: discipline.isActive ?? true,
  }));
}

export async function getPostStatuses(
  request: IPostsRequest,
  signal?: AbortSignal,
): Promise<IPostStatus[]> {
  const response = await request<IApiResponse<IPostStatus[]>>(
    "/catalog/status",
    {
      method: "GET",
      signal,
    },
  );

  return response.data
    .filter((status) => status.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function createPost(
  request: IPostsRequest,
  payload: IPostValues,
): Promise<IPost> {
  const response = await request<IApiResponse<IPost>>("/posts", {
    method: "POST",
    body: payload,
  });

  return response.data;
}

export async function updatePost(
  request: IPostsRequest,
  id: string,
  payload: IPostValues,
): Promise<IPost> {
  const response = await request<IApiResponse<IPost>>(
    `/posts/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: payload,
    },
  );

  return response.data;
}

export async function deletePost(
  request: IPostsRequest,
  id: string,
): Promise<void> {
  await request<void>(`/posts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
