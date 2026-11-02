import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

export default function ProfessorDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Painel do Professor" }} />
      <View style={styles.header}>
        <Text style={styles.logo}>EduBlog</Text>
        <Text style={styles.badge}>Professor</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Ionicons name="school-outline" size={40} color="#0F766E" />
          <Text style={styles.title} accessibilityRole="header">
            Painel do Professor
          </Text>
          <Text style={styles.greeting}>
            Olá, {user?.name?.trim() || "professor"}!
          </Text>
          <Text style={styles.message}>
            As ferramentas de gestão de publicações estarão disponíveis aqui em
            breve.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar aos conteúdos"
            onPress={goBack}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={18} color="#0F766E" />
            <Text style={styles.buttonText}>Voltar aos conteúdos</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F7FA" },
  header: {
    minHeight: 64,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#DCE5F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  logo: { color: "#008577", fontSize: 21, fontWeight: "800" },
  badge: {
    color: "#0F766E",
    backgroundColor: "#E8FAF6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 12,
    fontWeight: "600",
  },
  content: { width: "100%", maxWidth: 900, alignSelf: "center", padding: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE5F0",
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: { color: "#0F172A", fontSize: 26, lineHeight: 34, fontWeight: "700" },
  greeting: { color: "#334155", fontSize: 16, lineHeight: 24 },
  message: { color: "#64748B", fontSize: 15, lineHeight: 24 },
  button: {
    minHeight: 44,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#BFD0E5",
    borderRadius: 10,
  },
  buttonText: { color: "#0F766E", fontSize: 14, fontWeight: "600" },
  pressed: { opacity: 0.7 },
});
