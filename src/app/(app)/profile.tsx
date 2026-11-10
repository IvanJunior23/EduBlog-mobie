import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();

  const name = user?.name?.trim() || "Usuário";
  const username = user?.username ? `@${user.username}` : "—";
  const email = user?.email || "—";

  const role =
    user?.role === "PROFESSOR"
      ? "Professor"
      : user?.role === "ALUNO"
        ? "Aluno"
        : "Não informado";

  const initial = name.charAt(0).toUpperCase();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Meu perfil",
          headerShown: false,
        }}
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>EduBlog</Text>

            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{role}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Meu perfil</Text>

            <View style={styles.divider} />

            <View style={styles.userSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.username}>{username}</Text>

                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{role}</Text>
                </View>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>NOME</Text>
                <Text style={styles.detailValue}>{name}</Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>USERNAME</Text>
                <Text style={styles.detailValue}>{username}</Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>E-MAIL</Text>
                <Text style={styles.detailValue}>{email}</Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>TIPO DE USUÁRIO</Text>
                <Text style={styles.detailValue}>{role}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Link href="/" asChild>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.homeButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.homeButtonText}>Voltar para a Home</Text>
              </Pressable>
            </Link>
          </View>

          <Text style={styles.footer}>EduBlog · Área do usuário</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F7FA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DCE5F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 21,
    fontWeight: "800",
    color: "#008577",
  },
  headerBadge: {
    backgroundColor: "#E8FAF6",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  headerBadgeText: {
    color: "#00796B",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EAF1",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#DCE5F0",
    marginVertical: 20,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#C9FBF0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#00796B",
    fontSize: 32,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
    gap: 5,
  },
  userName: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "700",
  },
  username: {
    color: "#64748B",
    fontSize: 14,
  },
  roleBadge: {
    alignSelf: "flex-start",
    marginTop: 3,
    backgroundColor: "#E8FAF6",
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  roleBadgeText: {
    color: "#00796B",
    fontSize: 12,
    fontWeight: "600",
  },
  details: {
    gap: 12,
  },
  detailCard: {
    borderWidth: 1,
    borderColor: "#DCE5F0",
    borderRadius: 12,
    padding: 14,
    gap: 7,
  },
  detailLabel: {
    color: "#8492A6",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  detailValue: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "500",
  },
  homeButton: {
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#BFD0E5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  homeButtonText: {
    color: "#0F766E",
    fontWeight: "700",
    fontSize: 13,
  },
  buttonPressed: {
    opacity: 0.65,
  },
  footer: {
    textAlign: "center",
    color: "#8492A6",
    fontSize: 12,
    marginTop: 20,
  },
});
