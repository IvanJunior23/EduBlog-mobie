import ActionButton from "@/components/ui/ActionButton";
import LoadingState from "@/components/ui/LoadingState";
import { useAuth } from "@/context/AuthContext";
import StatusBadge from "@/features/posts/components/StatusBadge";
import { useApiClient } from "@/hooks/useApiClient";
import { getAllPosts } from "@/services/postsService";
import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  commonStyles,
  teacherDashboardStyles as styles,
} from "@/features/posts/styles";
import {
  formatDate,
  isDraftPost,
  isPublishedPost,
} from "@/features/posts/utils/post";
import type { IPost } from "@/interfaces/IPost";

export default function TeacherDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { request } = useApiClient();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setError("");
      const allPosts = await getAllPosts(request);

      setPosts(
        allPosts.filter(
          (post) =>
            post.author._id === user?.id || post.author.email === user?.email,
        ),
      );
    } catch {
      setError("Não foi possível carregar os dados do painel.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [request, user?.email, user?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPosts();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadPosts]);

  const publishedCount = useMemo(
    () => posts.filter(isPublishedPost).length,
    [posts],
  );
  const draftCount = useMemo(() => posts.filter(isDraftPost).length, [posts]);
  const latestPosts = useMemo(
    () =>
      [...posts]
        .sort(
          (left, right) =>
            new Date(right.createDate).getTime() -
            new Date(left.createDate).getTime(),
        )
        .slice(0, 5),
    [posts],
  );

  if (loading) {
    return <LoadingState message="Carregando painel do professor..." />;
  }

  return (
    <ScrollView
      contentContainerStyle={commonStyles.content}
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
    >
      <View style={styles.topRow}>
        <View style={styles.greeting}>
          <Text style={commonStyles.title}>Dashboard</Text>
          <Text style={commonStyles.subtitle}>Olá, {user?.name}.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert("Encerrar sessão", "Deseja sair da sua conta?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Sair",
                style: "destructive",
                onPress: () => void logout(),
              },
            ])
          }
        >
          <Text style={styles.logout}>Sair</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Dashboard indisponível</Text>
          <Text style={styles.errorText}>{error}</Text>
          <ActionButton
            label="Tentar novamente"
            onPress={() => void loadPosts()}
            variant="secondary"
          />
        </View>
      ) : (
        <>
          <View style={styles.metrics}>
            <MetricCard count={publishedCount} label="Posts publicados" />
            <MetricCard count={draftCount} label="Rascunhos" />
          </View>

          <View style={styles.actions}>
            <View style={styles.actionsRow}>
              <View style={styles.actionCell}>
                <ActionButton
                  label="Meus posts"
                  onPress={() => router.push("/teacher/posts" as Href)}
                  variant="secondary"
                />
              </View>
              <View style={styles.actionCell}>
                <ActionButton
                  label="Painel Administrativo"
                  onPress={() => router.push("/teacher/users" as Href)}
                  labelStyle={{ textAlign: "center" }}
                  variant="secondary"
                />
              </View>
            </View>
            <View style={styles.actionsRow}>
              <View style={styles.actionCell}>
                <ActionButton
                  label="Criar post"
                  onPress={() => router.push("/teacher/posts/new" as Href)}
                />
              </View>
              <View style={styles.actionCell}>
                <ActionButton
                  label="Voltar para Home"
                  onPress={() => router.dismissTo("/" as Href)}
                  variant="secondary"
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Últimos posts</Text>

            <Pressable onPress={() => router.push("/teacher/posts" as Href)}>
              <Text style={styles.link}>Ver todos</Text>
            </Pressable>
          </View>

          {latestPosts.length ? (
            latestPosts.map((post) => (
              <Pressable
                accessibilityRole="button"
                key={post._id}
                onPress={() =>
                  router.push(`/teacher/posts/${post._id}` as Href)
                }
                style={commonStyles.card}
              >
                <View style={styles.postTitleRow}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <StatusBadge post={post} />
                </View>
                <Text style={commonStyles.subtitle}>
                  {post.discipline.label} · Criado em{" "}
                  {formatDate(post.createDate)}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.empty}>
              Nenhum post encontrado para este professor.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

function MetricCard({ count, label }: { count: number; label: string }) {
  return (
    <View style={[commonStyles.card, styles.metric]}>
      <Text style={styles.metricCount}>{count}</Text>
      <Text style={commonStyles.subtitle}>{label}</Text>
    </View>
  );
}
