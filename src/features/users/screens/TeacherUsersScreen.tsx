import ActionButton from "@/components/ui/ActionButton";
import LoadingState from "@/components/ui/LoadingState";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { StatusBadge } from "@/features/posts/screens/TeacherDashboardScreen";
import { commonStyles } from "@/features/posts/styles";
import { USER_ROLE_CONFIG } from "@/features/users/constants/userRoleConfig";
import { teacherUsersStyles as styles } from "@/features/users/styles";
import { useApiClient } from "@/hooks/useApiClient";
import { useUsers } from "@/hooks/useUsers";
import { ITeacherUsersScreenProps, IUser } from "@/interfaces/IUser";
import { deleteUser } from "@/services/usersService";
import { getRequestErrorMessage } from "@/utils/apiError";
import { paginate } from "@/utils/paginate";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 6;

export default function TeacherUsersScreen({ role }: ITeacherUsersScreenProps) {
  const config = USER_ROLE_CONFIG[role];

  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { request } = useApiClient();
  const { users, isLoading, isRefreshing, error, reload, refresh, retry } =
    useUsers(role);

  const [page, setPage] = useState(1);

  const pagination = paginate(users, page, PAGE_SIZE);

  async function handleDelete(user: IUser) {
    try {
      await deleteUser(request, user._id);
      showSuccess(`O ${config.singular} foi excluído com sucesso.`);
      await reload();
    } catch (requestError: unknown) {
      showError(
        getRequestErrorMessage(
          requestError,
          `Não foi possível excluir o ${config.singular}. Verifique sua conexão e tente novamente.`,
        ),
      );
    }
  }

  function confirmDelete(user: IUser) {
    Alert.alert(
      `Excluir ${config.singular}`,
      `Tem certeza que deseja excluir "${user.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void handleDelete(user),
        },
      ],
    );
  }

  if (isLoading) {
    return <LoadingState message={`Carregando ${config.plural}...`} />;
  }

  return (
    <SafeAreaView edges={["top"]} style={commonStyles.page}>
      <FlatList
        contentContainerStyle={commonStyles.content}
        data={error ? [] : pagination.items}
        keyExtractor={(user) => user._id}
        ListEmptyComponent={
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>
              {error
                ? "Nenhum usuário carregado."
                : `Nenhum ${config.singular} cadastrado.`}
            </Text>
          </View>
        }
        ListFooterComponent={
          error ? undefined : (
            <Pagination
              currentPage={pagination.currentPage}
              onPageChange={setPage}
              totalPages={pagination.totalPages}
            />
          )
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={commonStyles.title}>{config.listTitle}</Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.dismissTo("/teacher/users" as Href)}
            >
              <Text style={styles.backLink}>← Voltar à Área Administrativa</Text>
            </Pressable>
            <ActionButton
              label={`Novo ${config.singular}`}
              onPress={() => router.push(config.createHref)}
            />
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <ActionButton
                  label="Tentar novamente"
                  onPress={() => void retry()}
                  variant="secondary"
                />
              </View>
            ) : (
              <Text style={styles.summary}>
                {pagination.total === 1
                  ? `1 ${config.singular} cadastrado`
                  : `${pagination.total} ${config.plural} cadastrados`}
              </Text>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            onRefresh={() => void refresh()}
            refreshing={isRefreshing}
            tintColor="#0f766e"
          />
        }
        renderItem={({ item }) => (
          <UserCard
            isCurrentUser={item._id === currentUser?.id}
            onDelete={() => confirmDelete(item)}
            onEdit={() => router.push(config.editHref(item._id))}
            user={item}
          />
        )}
      />
    </SafeAreaView>
  );
}

function UserCard({
  user,
  isCurrentUser,
  onEdit,
  onDelete,
}: {
  user: IUser;
  isCurrentUser: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={commonStyles.card}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.userName}>
          {user.name}
          {isCurrentUser ? " (você)" : ""}
        </Text>
        <StatusBadge
          label={user.isActive ? "Ativo" : "Inativo"}
          published={user.isActive}
        />
      </View>
      <Text style={styles.userMeta}>@{user.username}</Text>
      <Text style={styles.userMeta}>{user.email}</Text>
      <View style={styles.actions}>
        <TextAction label="Editar" onPress={onEdit} />
        {isCurrentUser ? null : (
          <TextAction danger label="Excluir" onPress={onDelete} />
        )}
      </View>
    </View>
  );
}

function TextAction({
  label,
  onPress,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.actionButton}
    >
      <Text style={[styles.actionLabel, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
}
