import { teacherDashboardStyles as styles } from "@/features/posts/styles";
import { IUserStatusBadgeProps } from "@/interfaces/IUser";
import { Text, View } from "react-native";

export default function UserStatusBadge({ isActive }: IUserStatusBadgeProps) {
  return (
    <View style={[styles.badge, isActive ? styles.published : styles.draft]}>
      <Text
        style={[
          styles.badgeText,
          isActive ? styles.publishedText : styles.draftText,
        ]}
      >
        {isActive ? "Ativo" : "Inativo"}
      </Text>
    </View>
  );
}
