import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApiClient } from "@/hooks/useApiClient";
import type { IPost } from "@/interfaces/IPost";
import type { IPostInformationProps } from "@/interfaces/ui/IUiPosts";
import { ApiError } from "@/services/apiClient";
import { getPostById } from "@/services/postsService";
import PostCover from "../components/PostCover";
import PostsFeedback from "../components/PostsFeedback";
import {
  formatPostDate,
  formatSemester,
  isPublishedPost,
} from "@/utils/postUtils";

function PostInformation({ label, value }: IPostInformationProps) {
  return (
    <View style={styles.information}>
      <Text style={styles.informationLabel}>{label}</Text>
      <Text style={styles.informationValue}>{value || "Não informado"}</Text>
    </View>
  );
}

export default function PostReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { request } = useApiClient();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      setPost(null);
      setError(false);
      setNotFound(false);
      setLoading(true);

      async function loadPost() {
        try {
          if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) {
            setNotFound(true);
            return;
          }

          const response = await getPostById(request, id, controller.signal);
          if (controller.signal.aborted) return;

          if (!response || !isPublishedPost(response)) {
            setNotFound(true);
            return;
          }

          setPost(response);
        } catch (cause) {
          if (controller.signal.aborted) return;
          if (
            cause instanceof ApiError &&
            (cause.status === 404 || cause.status === 400)
          ) {
            setNotFound(true);
          } else {
            setError(true);
          }
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      }

      void loadPost();
    }, 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [id, request, revision]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: post?.title || "Leitura do conteúdo" }} />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar aos conteúdos"
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#0F766E" />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
        <Text style={styles.logo}>EduBlog</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <PostsFeedback loading title="Carregando conteúdo..." />
        ) : notFound ? (
          <PostsFeedback
            title="Conteúdo não encontrado"
            message="Esta publicação foi removida ou não está disponível para leitura."
            actionLabel="Voltar aos conteúdos"
            onAction={goBack}
          />
        ) : error || !post ? (
          <PostsFeedback
            title="Não foi possível abrir o conteúdo"
            message="Verifique sua conexão e tente novamente."
            actionLabel="Tentar novamente"
            onAction={() => setRevision((value) => value + 1)}
          />
        ) : (
          <View style={styles.article}>
            <PostCover
              imageUrl={post.imageUrl}
              discipline={post.discipline?.label ?? "Conteúdo"}
            />
            <View style={styles.articleBody}>
              <View style={styles.badges}>
                <Text style={styles.discipline}>
                  {post.discipline?.label ?? "Sem disciplina"}
                </Text>
                {post.isFeatured ? (
                  <Text style={styles.featured}>★ Em destaque</Text>
                ) : null}
              </View>
              <Text style={styles.title} accessibilityRole="header" selectable>
                {post.title}
              </Text>
              <View style={styles.informationGrid}>
                <PostInformation label="Autor" value={post.author?.name} />
                <PostInformation
                  label="Disciplina"
                  value={post.discipline?.label}
                />
                <PostInformation
                  label="Classificação"
                  value={post.status?.label}
                />
                <PostInformation
                  label="Semestre"
                  value={formatSemester(post.semester)}
                />
                <PostInformation label="Série/ano" value={post.series} />
                <PostInformation
                  label="Data"
                  value={formatPostDate(post.createDate)}
                />
              </View>
              {post.summary?.trim() ? (
                <Text style={styles.summary} selectable>
                  {post.summary}
                </Text>
              ) : null}
              <View style={styles.paragraphs}>
                {post.content?.trim() ? (
                  post.content
                    .split(/\n\s*\n/)
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, index) => (
                      <Text key={index} style={styles.paragraph} selectable>
                        {paragraph}
                      </Text>
                    ))
                ) : (
                  <Text style={styles.paragraph}>Conteúdo não informado.</Text>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F7FA" },
  header: {
    minHeight: 64,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#DCE5F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 44,
    paddingRight: 12,
  },
  backText: { color: "#0F766E", fontSize: 14, fontWeight: "600" },
  logo: { color: "#008577", fontSize: 21, fontWeight: "800" },
  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 32,
  },
  article: {
    borderWidth: 1,
    borderColor: "#DCE5F0",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  articleBody: { padding: 20, gap: 22 },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  discipline: {
    color: "#0F766E",
    fontSize: 13,
    fontWeight: "700",
    backgroundColor: "#E8FAF6",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  featured: { color: "#8A5400", fontSize: 13, fontWeight: "600" },
  title: { color: "#0F172A", fontSize: 28, lineHeight: 37, fontWeight: "800" },
  informationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 18,
  },
  information: { flexBasis: "45%", flexGrow: 1, gap: 5 },
  informationLabel: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  informationValue: { color: "#334155", fontSize: 14, lineHeight: 21 },
  summary: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 26,
    backgroundColor: "#F3F7FA",
    borderLeftWidth: 3,
    borderColor: "#0F766E",
    padding: 16,
  },
  paragraphs: { gap: 18 },
  paragraph: { color: "#334155", fontSize: 17, lineHeight: 29 },
});
