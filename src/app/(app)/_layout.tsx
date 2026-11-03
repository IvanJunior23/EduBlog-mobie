import { Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={user?.role === "PROFESSOR"}>
        <Stack.Screen name="teacher" />
      </Stack.Protected>
    </Stack>
  );
}
