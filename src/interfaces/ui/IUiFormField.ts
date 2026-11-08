import { TextInputProps } from "react-native";

export interface IFormFieldProps
  extends Omit<TextInputProps, "style" | "onChangeText"> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  hint?: string;
  isPassword?: boolean;
}
