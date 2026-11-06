import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { ISelectFieldProps } from "@/interfaces/ui/IUiSelectField";

export default function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
  error,
}: ISelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.label ?? placeholder}`}
        onPress={() => setIsOpen(true)}
        style={[styles.select, error && styles.invalid]}
      >
        <Text style={[styles.selectText, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>

        <Text style={styles.chevron}>⌄</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>{label}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                  style={styles.option}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      item.value === value && styles.selectedOption,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  select: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: "#0f172a",
    fontSize: 15,
    flexShrink: 1,
  },
  placeholder: {
    color: "#64748b",
  },
  chevron: {
    color: "#64748b",
    fontSize: 20,
    paddingLeft: 8,
  },
  invalid: {
    borderColor: "#be123c",
  },
  error: {
    color: "#be123c",
    fontSize: 13,
    marginTop: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "75%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
  },
  modalTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  option: {
    minHeight: 48,
    justifyContent: "center",
    borderBottomColor: "#e2e8f0",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    color: "#0f172a",
    fontSize: 16,
  },
  selectedOption: {
    color: "#0f766e",
    fontWeight: "700",
  },
});
