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

  const loadUsers = useCallback(async () => {
    try {
      const allUsers = await getUsers(request);

      setUsers(filterUsersByRole(allUsers, role));
      setError("");
    } catch (loadError: unknown) {
      setError(
        getRequestErrorMessage(
          loadError,
          "Não foi possível carregar os usuários. Verifique sua conexão e tente novamente.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [request, role]);

  useFocusEffect(
    useCallback(() => {
      void loadUsers();
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
    reload: loadUsers,
    refresh,
    retry,
  };
}
