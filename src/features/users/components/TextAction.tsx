import { teacherUsersStyles as styles } from "@/features/users/styles";
import { ITextActionProps } from "@/interfaces/IUser";
import { Pressable, Text } from "react-native";

export default function TextAction({
  label,
  onPress,
  danger = false,
}: ITextActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.actionButton}
    >
      <Text style={[styles.actionLabel, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
}
