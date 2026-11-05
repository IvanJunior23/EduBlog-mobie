import type { IPost } from "@/interfaces/IPost";
import type { IPostFilters } from "@/interfaces/IPostFilters";

export const emptyPostFilters: IPostFilters = {
  discipline: "",
  author: "",
  series: "",
  semester: "",
};

export function isPublishedPost(post: IPost): boolean {
  // The public endpoints also return drafts/archived posts in the current API.
  return post.status?.label?.trim().toLocaleLowerCase("pt-BR") === "publicado";
}

export function filterPosts(posts: IPost[], filters: IPostFilters): IPost[] {
  // Reapply catalog filters: the API's in-memory search ignores these fields.
  return posts.filter(
    (post) =>
      isPublishedPost(post) &&
      (!filters.discipline || post.discipline?.label === filters.discipline) &&
      (!filters.author || post.author?.name === filters.author) &&
      (!filters.series || post.series === filters.series) &&
      (!filters.semester || post.semester === filters.semester),
  );
}

export function sortPosts(posts: IPost[]): IPost[] {
  return [...posts].sort(
    (a, b) => Date.parse(b.createDate) - Date.parse(a.createDate),
  );
}

export function getFilterOptions(
  values: (string | null | undefined)[],
): string[] {
  return [
    ...new Set(values.filter((value): value is string => !!value?.trim())),
  ].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
}

export function formatPostDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data não informada"
    : date.toLocaleDateString("pt-BR");
}

export function formatSemester(value?: string | null): string {
  if (!value?.trim()) return "Não informado";
  return /^\d+$/.test(value) ? `${value}º semestre` : value;
}

export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function formatProfessorName(name: string): string {
  const trimmed = name.trim();

  return /^prof\.?\s/i.test(trimmed) ? trimmed : `Prof. ${trimmed}`;
}

export function estimateReadingTime(...texts: string[]): number {
  const words = texts
    .join(" ")
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return Math.max(1, Math.ceil(words.length / 200));
}
