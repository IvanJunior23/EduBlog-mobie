import ActionButton from "@/components/ui/ActionButton";
import { commonStyles } from "@/features/posts/styles";
import { teacherUsersHomeStyles as styles } from "@/features/users/styles";
import { IUserGroupCardProps } from "@/interfaces/IUser";
import { Text, View } from "react-native";

export default function UserGroupCard({
  title,
  description,
  label,
  onPress,
}: IUserGroupCardProps) {
  return (
    <View style={commonStyles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={commonStyles.subtitle}>{description}</Text>
      <ActionButton label={label} onPress={onPress} />
    </View>
  );
}
