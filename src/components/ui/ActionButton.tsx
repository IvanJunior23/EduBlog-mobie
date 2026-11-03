import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
} from "react-native";

interface IActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  labelStyle?: StyleProp<TextStyle>;
}

export default function ActionButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  labelStyle,
}: IActionButtonProps) {
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.primaryButton,
        variant === "secondary" && styles.secondaryButton,
        variant === "danger" && styles.dangerButton,
        pressed && !isInactive && styles.buttonPressed,
        isInactive && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#0f172a" : "#ffffff"}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "secondary"
              ? styles.secondaryLabel
              : styles.primaryLabel,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#0f766e",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  dangerButton: {
    backgroundColor: "#be123c",
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#ffffff",
  },
  secondaryLabel: {
    color: "#0f172a",
  },
});
