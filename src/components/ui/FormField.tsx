import { colors, commonStyles } from "@/features/posts/styles";
import { IFormFieldProps } from "@/interfaces/ui/IUiFormField";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function FormField({
  label,
  value,
  onChangeText,
  error,
  hint,
  isPassword = false,
  editable = true,
  ...inputProps
}: IFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View>
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          editable={editable}
          onChangeText={onChangeText}
          placeholderTextColor={colors.muted}
          secureTextEntry={isPassword && !showPassword}
          style={[
            commonStyles.input,
            isPassword && styles.passwordInput,
            error && styles.invalid,
            !editable && styles.disabled,
          ]}
          value={value}
        />

        {isPassword ? (
          <Pressable
            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            accessibilityRole="button"
            disabled={!editable}
            hitSlop={8}
            onPress={() => setShowPassword((current) => !current)}
            style={styles.passwordButton}
          >
            <Ionicons
              color={colors.muted}
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
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
  passwordInput: {
    paddingRight: 48,
  },
  invalid: {
    borderColor: colors.red,
  },
  disabled: {
    backgroundColor: colors.background,
  },
  passwordButton: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  error: {
    color: colors.red,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
});
