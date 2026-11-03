import ActionButton from "@/components/ui/ActionButton";
import LoadingState from "@/components/ui/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useApiClient } from "@/hooks/useApiClient";
import type { IPost } from "@/interfaces/IPost";
import { getPostById } from "@/services/postsService";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  commonStyles,
  postViewStyles as styles,
} from "@/features/posts/styles";
import { formatDate } from "@/features/posts/utils/post";

function resolveParam(param: string | string[] | undefined) {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
}

export default function PostViewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = resolveParam(rawId);

  const { user } = useAuth();
  const { request } = useApiClient();
  const [post, setPost] = useState<IPost | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPost() {
      if (!postId) {
        setError("Publicação não encontrada.");
        setLoading(false);
        return;
      }

      try {
        const result = await getPostById(request, postId);

        if (active) {
          setPost(result);
        }
      } catch {
        if (active) {
          setError("Não foi possível carregar esta publicação.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      active = false;
    };
  }, [postId, request]);

  if (loading) {
    return <LoadingState message="Carregando publicação..." />;
  }

  if (!post || error) {
    return (
      <View style={[commonStyles.card, styles.errorCard]}>
        <Text style={styles.error}>{error || "Publicação não encontrada."}</Text>
        <ActionButton
          label="Voltar"
          onPress={() => {
            if (user?.role === "PROFESSOR") {
              router.dismissTo("/teatcher/posts" as Href);
              return;
            }

            router.back();
          }}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        commonStyles.content,
        {
          paddingBottom: insets.bottom + 32,
        },
      ]}
    >
      {user?.role === "PROFESSOR" ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.dismissTo("/teatcher/dashboard" as Href)}
        >
          <Text style={styles.backLink}>← Voltar ao painel do professor</Text>
        </Pressable>
      ) : null}

      <View style={styles.article}>
        {post.imageUrl ? (
          <Image
            accessibilityLabel={post.title}
            resizeMode="cover"
            source={{ uri: post.imageUrl }}
            style={styles.cover}
          />
        ) : (
          <View style={styles.fallbackCover}>
            <Text style={styles.fallbackText}>
              {post.discipline.label.slice(0, 3).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.articleBody}>
          <View style={styles.badges}>
            <Badge label={post.discipline.label} variant="teal" />
            {post.series ? <Badge label={post.series} variant="slate" /> : null}
            {post.semester ? (
              <Badge label={`${post.semester} semestre`} variant="slate" />
            ) : null}
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.meta}>
            <Text style={styles.metaStrong}>{formatProfessorName(post.author.name)}</Text>
            {" · "}
            {formatDate(post.createDate)}
            {" · "}
            {estimateReadingTime(post.summary, post.content)} min de leitura
          </Text>

          <Text style={styles.summary}>{post.summary}</Text>

          <View style={styles.paragraphs}>
            {splitParagraphs(post.content).map((paragraph, index) => (
              <Text key={`${post._id}-paragraph-${index}`} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {user?.role === "PROFESSOR" ? (
        <View style={styles.actions}>
          <Text style={commonStyles.subtitle}>Status atual: {post.status.label}</Text>
          <ActionButton
            label="Editar publicação"
            onPress={() => router.push(`/teatcher/posts/${post._id}/edit` as Href)}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

function splitParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function formatProfessorName(name: string) {
  const trimmed = name.trim();

  return /^prof\.?\s/i.test(trimmed) ? trimmed : `Prof. ${trimmed}`;
}

function estimateReadingTime(...texts: string[]) {
  const words = texts
    .join(" ")
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return Math.max(1, Math.ceil(words.length / 200));
}

function Badge({ label, variant }: { label: string; variant: "teal" | "slate" }) {
  return (
    <View
      style={[styles.badge, variant === "teal" ? styles.tealBadge : styles.slateBadge]}
    >
      <Text
        style={[
          styles.badgeText,
          variant === "teal" ? styles.tealBadgeText : styles.slateBadgeText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
