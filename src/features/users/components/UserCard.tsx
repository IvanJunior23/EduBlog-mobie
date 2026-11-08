import { commonStyles } from "@/features/posts/styles";
import TextAction from "@/features/users/components/TextAction";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import { teacherUsersStyles as styles } from "@/features/users/styles";
import { IUserCardProps } from "@/interfaces/IUser";
import { Text, View } from "react-native";

export default function UserCard({
  user,
  isCurrentUser,
  onEdit,
  onDelete,
}: IUserCardProps) {
  return (
    <View style={commonStyles.card}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.userName}>
          {user.name}
          {isCurrentUser ? " (você)" : ""}
        </Text>
        <UserStatusBadge isActive={user.isActive} />
      </View>
      <Text style={styles.userMeta}>@{user.username}</Text>
      <Text style={styles.userMeta}>{user.email}</Text>
      <View style={styles.actions}>
        <TextAction label="Editar" onPress={onEdit} />
        {isCurrentUser ? null : (
          <TextAction danger label="Excluir" onPress={onDelete} />
        )}
      </View>
    </View>
  );
}
