import { teacherDashboardStyles as styles } from "@/features/posts/styles";
import { isPublishedPost } from "@/features/posts/utils/post";
import type { IStatusBadgeProps } from "@/interfaces/ui/IUiStatusBadge";
import { Text, View } from "react-native";

export default function StatusBadge({ post }: IStatusBadgeProps) {
  const published = isPublishedPost(post);

  return (
    <View style={[styles.badge, published ? styles.published : styles.draft]}>
      <Text
        style={[
          styles.badgeText,
          published ? styles.publishedText : styles.draftText,
        ]}
      >
        {post.status.label}
      </Text>
    </View>
  );
}
