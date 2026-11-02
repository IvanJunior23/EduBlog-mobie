import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { IPostCoverProps } from "@/interfaces/ui/IUiPosts";

export default function PostCover({ imageUrl, discipline }: IPostCoverProps) {
  const [failedUrl, setFailedUrl] = useState<string>();

  if (imageUrl && failedUrl !== imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.cover}
        resizeMode="cover"
        accessible={false}
        onError={() => setFailedUrl(imageUrl)}
      />
    );
  }

  return (
    <View style={[styles.cover, styles.placeholder]} accessible={false}>
      <Ionicons name="book-outline" size={36} color="#0F766E" />
      <Text style={styles.label}>{discipline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { width: "100%", aspectRatio: 2.2, backgroundColor: "#DDF3EE" },
  placeholder: { alignItems: "center", justifyContent: "center", gap: 8 },
  label: { color: "#0F766E", fontSize: 16, fontWeight: "600" },
});
