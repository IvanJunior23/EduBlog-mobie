import ActionButton from "@/components/ui/ActionButton";
import { commonStyles } from "@/features/posts/styles";
import { USER_ROLE_CONFIG } from "@/features/users/constants/userRoleConfig";
import { teacherUsersHomeStyles as styles } from "@/features/users/styles";
import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeacherUsersHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={commonStyles.page}>
      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Área Administrativa</Text>
          <Text style={commonStyles.subtitle}>
            Gerencie os usuários do EduBlog.
          </Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.dismissTo("/teacher/dashboard" as Href)}
          >
            <Text style={styles.backLink}>← Voltar ao Dashboard</Text>
          </Pressable>
        </View>

        <UserGroupCard
          description="Cadastre, edite, inative e exclua professores."
          label="Gerenciar professores"
          onPress={() => router.push(USER_ROLE_CONFIG.PROFESSOR.listHref)}
          title="Professores"
        />

        <UserGroupCard
          description="Cadastre, edite, inative e exclua alunos."
          label="Gerenciar alunos"
          onPress={() => router.push(USER_ROLE_CONFIG.ALUNO.listHref)}
          title="Alunos"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function UserGroupCard({
  title,
  description,
  label,
  onPress,
}: {
  title: string;
  description: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <View style={commonStyles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={commonStyles.subtitle}>{description}</Text>
      <ActionButton label={label} onPress={onPress} />
    </View>
  );
}
