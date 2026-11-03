import type { IPostValues } from "@/interfaces/IPostValues";

export type FormField = keyof IPostValues;
export type FieldErrors = Partial<Record<FormField, string>>;

export const emptyPostValues: IPostValues = {
  title: "",
  summary: "",
  content: "",
  disciplineId: "",
  statusId: "",
  semester: "",
  series: "",
  imageUrl: "",
  isFeatured: false,
};

export function plainText(value: string) {
  return value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function parseIntegerInRange(
  value: string,
  min: number,
  max: number,
): number | null {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const numeric = Number.parseInt(trimmed, 10);

  if (!Number.isInteger(numeric) || numeric < min || numeric > max) {
    return null;
  }

  return numeric;
}

export function parseSemesterNumber(value: string): number | null {
  return parseIntegerInRange(value, 1, 4);
}

export function parseSeriesNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  return parseIntegerInRange(value, 1, 9);
}

export function normalizeSemesterInput(value: string): string {
  const match = value.match(/\d+/);

  if (!match) {
    return "";
  }

  const numeric = parseSemesterNumber(match[0]);

  return numeric === null ? "" : String(numeric);
}

export function normalizeSeriesInput(value: string): string {
  const match = value.match(/\d+/);

  if (!match) {
    return "";
  }

  const numeric = parseSeriesNumber(match[0]);

  return numeric === null ? "" : String(numeric);
}

export function formatSemesterForApi(value: string): string {
  const numeric = parseSemesterNumber(normalizeSemesterInput(value));

  return numeric === null ? value.trim() : String(numeric);
}

export function formatSeriesForApi(value: string): string {
  const numeric = parseSeriesNumber(normalizeSeriesInput(value));

  if (numeric === null) {
    return value.trim();
  }

  return `${numeric}º ano`;
}

export function validatePost(
  values: IPostValues,
  disciplines: { _id: string; isActive: boolean }[],
  statuses: { _id: string; isActive?: boolean; label?: string }[],
): FieldErrors {
  const errors: FieldErrors = {};
  const titleLength = plainText(values.title).length;
  const summaryLength = plainText(values.summary).length;

  if (titleLength < 5 || titleLength > 100) {
    errors.title = "Informe um título com 5 a 100 caracteres.";
  }

  if (summaryLength < 10 || summaryLength > 300) {
    errors.summary = "Informe um resumo com 10 a 300 caracteres.";
  }

  if (plainText(values.content).length < 10) {
    errors.content = "Escreva um conteúdo com pelo menos 10 caracteres.";
  }

  if (parseSemesterNumber(values.semester) === null) {
    errors.semester = "Informe um semestre inteiro entre 1 e 4.";
  }

  if (values.series.trim() && parseSeriesNumber(values.series) === null) {
    errors.series = "Informe um ano inteiro entre 1 e 9.";
  }

  if (
    !disciplines.some(
      (item) => item._id === values.disciplineId && item.isActive,
    )
  ) {
    errors.disciplineId = "Selecione uma disciplina disponível.";
  }

  const selectedStatus = statuses.find(
    (item) => item._id === values.statusId && item.isActive,
  );

  const isArchivedStatus =
    selectedStatus?.label?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim() === "arquivado";

  if (!selectedStatus || isArchivedStatus) {
    errors.statusId = "Selecione um status disponível.";
  }

  if (values.imageUrl.trim()) {
    try {
      const url = new URL(values.imageUrl.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Protocolo inválido");
      }
    } catch {
      errors.imageUrl =
        "Informe uma URL de imagem válida, começando com http:// ou https://.";
    }
  }

  return errors;
}
