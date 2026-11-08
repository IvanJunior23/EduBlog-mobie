import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { filterUsersByRole } from "@/features/users/utils/user";
import { IUser } from "@/interfaces/IUser";
import { getUsers } from "@/services/usersService";
import { UserRole } from "@/types/UserRole";
import { getRequestErrorMessage } from "@/utils/apiError";
import { useApiClient } from "./useApiClient";

export function useUsers(role: UserRole) {
  const { request } = useApiClient();

  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const allUsers = await getUsers(request, signal);

        if (signal?.aborted) {
          return;
        }

        setUsers(filterUsersByRole(allUsers, role));
        setError("");
      } catch (loadError: unknown) {
        if (signal?.aborted) {
          return;
        }

        setError(
          getRequestErrorMessage(
            loadError,
            "Não foi possível carregar os usuários. Verifique sua conexão e tente novamente.",
          ),
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [request, role],
  );

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      void loadUsers(controller.signal);

      return () => {
        controller.abort();
      };
    }, [loadUsers]),
  );

  async function refresh() {
    setIsRefreshing(true);

    await loadUsers();

    setIsRefreshing(false);
  }

  async function retry() {
    setIsLoading(true);

    await loadUsers();
  }

  return {
    users,
    isLoading,
    isRefreshing,
    error,
    reload: () => loadUsers(),
    refresh,
    retry,
  };
}
