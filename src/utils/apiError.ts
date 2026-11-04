import { ApiError } from "@/services/apiClient";

export function getRequestErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  if (error.status === 401) {
    return "Sua sessão expirou. Entre novamente para continuar.";
  }

  if (error.status === 403) {
    return "Você não tem permissão para realizar esta ação.";
  }

  if (error.status === 404) {
    return "Cadastro não encontrado.";
  }

  if (error.status >= 500) {
    return fallback;
  }

  return error.message || fallback;
}
