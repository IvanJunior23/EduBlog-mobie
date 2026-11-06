import ActionButton from "@/components/ui/ActionButton";
import LoadingState from "@/components/ui/LoadingState";
import SelectField from "@/components/ui/SelectField";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  commonStyles,
  teacherPostsStyles as styles,
} from "@/features/posts/styles";
import StatusBadge from "@/features/posts/components/StatusBadge";
import {
  filterTeacherPosts,
  formatDate,
} from "@/features/posts/utils/post";
import { useApiClient } from "@/hooks/useApiClient";
import type { IPost } from "@/interfaces/IPost";
import { deletePost, getAllPosts } from "@/services/postsService";
import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";

type StatusFilter = "todos" | "publicado" | "rascunho";

export default function TeacherPostsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { request } = useApiClient();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");

  const loadPosts = useCallback(async () => {
    try {
      setError("");
      setPosts(await getAllPosts(request));
    } catch {
      setError("Não foi possível carregar os seus posts.");
      showError("Não foi possível carregar os seus posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [request, showError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPosts();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadPosts]);

  const disciplines = useMemo(
    () =>
      Array.from(new Set(posts.map((post) => post.discipline.label))).sort(
        (a, b) => a.localeCompare(b, "pt-BR"),
      ),
    [posts],
  );

  const filteredPosts = useMemo(
    () =>
      filterTeacherPosts(
        posts,
        user?.id ?? "",
        user?.email ?? "",
        search,
        discipline,
        status,
      ),
    [discipline, posts, search, status, user?.email, user?.id],
  );

  const handleDelete = useCallback(
    async (post: IPost) => {
      try {
        await deletePost(request, post._id);
        setPosts((current) => current.filter((item) => item._id !== post._id));
        showSuccess("Post excluído com sucesso.");
      } catch (requestError: unknown) {
        const statusCode =
          typeof requestError === "object" &&
          requestError !== null &&
          "status" in requestError
            ? Number((requestError as { status?: number }).status)
            : undefined;

        const message =
          statusCode === 403
            ? "Você não tem permissão para excluir este post."
            : statusCode === 404
              ? "Post não encontrado para exclusão."
              : "Não foi possível excluir o post. Verifique sua conexão e tente novamente.";

        showError(message);
      }
    },
    [request, showError, showSuccess],
  );

  const confirmDelete = useCallback(
    (post: IPost) => {
      Alert.alert(
        "Excluir post",
        `Tem certeza que deseja excluir "${post.title}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => void handleDelete(post),
          },
        ],
      );
    },
    [handleDelete],
  );

  if (loading) {
    return <LoadingState message="Carregando seus posts..." />;
  }

  return (
    <View style={styles.page}>
      <FlatList
        contentContainerStyle={commonStyles.content}
        data={error ? [] : filteredPosts}
        keyExtractor={(post) => post._id}
        ListEmptyComponent={
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>
              {error
                ? "Nenhum conteúdo carregado."
                : "Nenhum post encontrado para os filtros aplicados."}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={commonStyles.title}>Meus Posts</Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.dismissTo("/teacher/dashboard" as Href)}
            >
              <Text style={styles.backLink}>← Voltar ao Dashboard</Text>
            </Pressable>
            <ActionButton
              label="Novo post"
              onPress={() => router.push("/teacher/posts/new" as Href)}
            />
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <ActionButton
                  label="Tentar novamente"
                  onPress={() => void loadPosts()}
                  variant="secondary"
                />
              </View>
            ) : null}
            <View style={styles.filters}>
              <TextInput
                accessibilityLabel="Buscar post por título"
                onChangeText={setSearch}
                placeholder="Buscar por título..."
                returnKeyType="search"
                style={commonStyles.input}
                value={search}
              />
              <SelectField
                label="Disciplina"
                onChange={setDiscipline}
                options={[
                  { label: "Todas as disciplinas", value: "" },
                  ...disciplines.map((item) => ({ label: item, value: item })),
                ]}
                placeholder="Todas as disciplinas"
                value={discipline}
              />
            </View>
            <View style={styles.statusFilters}>
              {(
                [
                  ["todos", "Todos"],
                  ["publicado", "Publicados"],
                  ["rascunho", "Rascunhos"],
                ] as const
              ).map(([value, label]) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: status === value }}
                  key={value}
                  onPress={() => setStatus(value)}
                  style={[
                    styles.filterButton,
                    status === value && styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      status === value && styles.activeFilterText,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              setRefreshing(true);
              void loadPosts();
            }}
            refreshing={refreshing}
            tintColor="#0f766e"
          />
        }
        renderItem={({ item }) => (
          <PostCard
            onDelete={() => confirmDelete(item)}
            onEdit={() =>
              router.push(`/teacher/posts/${item._id}/edit` as Href)
            }
            onView={() => router.push(`/teacher/posts/${item._id}` as Href)}
            post={item}
          />
        )}
      />
    </View>
  );
}

function PostCard({
  post,
  onView,
  onEdit,
  onDelete,
}: {
  post: IPost;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={commonStyles.card}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <StatusBadge post={post} />
      </View>
      <Text style={commonStyles.subtitle}>{post.discipline.label}</Text>
      <Text style={styles.date}>Criado em {formatDate(post.createDate)}</Text>
      <View style={styles.actions}>
        <TextAction label="Ver" onPress={onView} />
        <TextAction label="Editar" onPress={onEdit} />
        <TextAction label="Excluir" onPress={onDelete} danger />
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
