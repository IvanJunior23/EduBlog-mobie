import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { IPostFilterChipsProps } from "@/interfaces/ui/IUiPosts";

export default function PostFilterChips({
  label,
  options,
  value,
  onChange,
  allLabel = "Todos",
  formatLabel,
}: IPostFilterChipsProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.options}
      >
        {["", ...options].map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: value === option }}
            accessibilityLabel={`${label}: ${option ? (formatLabel?.(option) ?? option) : allLabel}`}
            onPress={() => onChange(option)}
            style={[styles.chip, value === option && styles.selected]}
          >
            <Text
              style={[styles.text, value === option && styles.selectedText]}
            >
              {option ? (formatLabel?.(option) ?? option) : allLabel}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  label: { color: "#334155", fontSize: 13, fontWeight: "600" },
  options: { gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#CDDCE6",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    minHeight: 44,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  selected: { borderColor: "#0F766E", backgroundColor: "#0F766E" },
  text: { color: "#475569", fontSize: 13, fontWeight: "500" },
  selectedText: { color: "#FFFFFF" },
});
