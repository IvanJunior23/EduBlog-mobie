import type { IPost } from "@/interfaces/IPost";

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isPublishedPost(post: IPost) {
  return normalizeText(post.status.label) === "publicado";
}

export function isDraftPost(post: IPost) {
  return normalizeText(post.status.label) === "rascunho";
}

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function filterTeacherPosts(
  posts: IPost[],
  userId: string,
  email: string,
  searchTerm: string,
  discipline: string,
  status: "todos" | "publicado" | "rascunho",
) {
  const search = normalizeText(searchTerm);

  return posts
    .filter((post) => post.author._id === userId || post.author.email === email)
    .filter((post) => !search || normalizeText(post.title).includes(search))
    .filter((post) => !discipline || post.discipline.label === discipline)
    .filter((post) => {
      if (status === "publicado") {
        return isPublishedPost(post);
      }

      if (status === "rascunho") {
        return isDraftPost(post);
      }

      return true;
    })
    .sort(
      (left, right) =>
        new Date(right.createDate).getTime() - new Date(left.createDate).getTime(),
    );
}
