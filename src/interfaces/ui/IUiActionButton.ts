import type { StyleProp, TextStyle } from "react-native";

export interface IActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  labelStyle?: StyleProp<TextStyle>;
}
