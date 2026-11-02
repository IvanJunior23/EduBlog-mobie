import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { IPostCardProps } from "@/interfaces/ui/IUiPosts";
import { formatPostDate } from "@/utils/postUtils";
import PostCover from "./PostCover";

export default function PostCard({ post }: IPostCardProps) {
  return (
    <Link href={{ pathname: "/posts/[id]", params: { id: post._id } }} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Ler ${post.title}`}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <PostCover
          imageUrl={post.imageUrl}
          discipline={post.discipline?.label ?? "Conteúdo"}
        />
        <View style={styles.body}>
          <View style={styles.badges}>
            <Text style={styles.discipline}>
              {post.discipline?.label ?? "Sem disciplina"}
            </Text>
            {post.isFeatured ? (
              <Text style={styles.featured}>★ Destaque</Text>
            ) : null}
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
          <Text style={styles.summary} numberOfLines={2}>
            {post.summary}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {post.author?.name ?? "Autor não informado"} ·{" "}
            {formatPostDate(post.createDate)}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.series}>
              {post.series || "Série não informada"}
            </Text>
            <View style={styles.read}>
              <Text style={styles.readText}>Ler conteúdo</Text>
              <Ionicons name="arrow-forward" size={16} color="#0F766E" />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE5F0",
    borderRadius: 16,
    overflow: "hidden",
  },
  pressed: { opacity: 0.75 },
  body: { padding: 18, gap: 10 },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  discipline: {
    color: "#0F766E",
    backgroundColor: "#E8FAF6",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "700",
  },
  featured: { color: "#8A5400", fontSize: 12, fontWeight: "600" },
  title: { color: "#0F172A", fontSize: 20, lineHeight: 27, fontWeight: "700" },
  summary: { color: "#475569", fontSize: 14, lineHeight: 21 },
  meta: { color: "#64748B", fontSize: 12, lineHeight: 19 },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderColor: "#EDF2F7",
    paddingTop: 12,
  },
  series: { fontSize: 12, color: "#64748B" },
  read: { flexDirection: "row", alignItems: "center", gap: 6 },
  readText: { color: "#0F766E", fontSize: 13, fontWeight: "700" },
});
