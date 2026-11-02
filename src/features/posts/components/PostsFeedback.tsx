import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { IPostsFeedbackProps } from "@/interfaces/ui/IUiPosts";

export default function PostsFeedback({
  loading,
  title,
  message,
  actionLabel,
  onAction,
}: IPostsFeedbackProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {loading ? (
        <ActivityIndicator size="large" color="#0F766E" />
      ) : (
        <Ionicons name="book-outline" size={32} color="#0F766E" />
      )}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onAction && actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 28, gap: 12 },
  title: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0F766E",
    borderRadius: 10,
    paddingHorizontal: 20,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  pressed: { opacity: 0.7 },
});
