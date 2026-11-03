import {
  IToastContainerProps,
  IToastItemProps,
} from "@/interfaces/ui/IUiToast";
import { useEffect, useMemo } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ToastItem({ toast, onClose }: IToastItemProps) {
  const opacity = useMemo(() => new Animated.Value(0), []);

  const translateY = useMemo(() => new Animated.Value(10), []);

  useEffect(() => {
    if (toast.leaving) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 10,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [toast.leaving, opacity, translateY]);

  const isError = toast.type === "error";

  return (
    <Animated.View
      style={[
        styles.toast,

        isError ? styles.error : styles.success,

        {
          opacity,
          transform: [
            {
              translateY,
            },
          ],
        },
      ]}
    >
      <Text style={styles.message}>{toast.message}</Text>

      <Pressable
        onPress={() => onClose(toast.id)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.closeButton,
          pressed && styles.closeButtonPressed,
        ]}
      >
        <Text style={styles.close}>×</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ToastContainer({
  toasts,
  onClose,
}: IToastContainerProps) {
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          bottom: insets.bottom + 16,
        },
      ]}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },

  toast: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 16,

    elevation: 5,

    shadowColor: "#0f172a",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  success: {
    borderLeftColor: "#22c55e",
  },

  error: {
    borderLeftColor: "#ef4444",
  },

  message: {
    flex: 1,
    marginRight: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#334155",
  },

  closeButton: {
    padding: 2,
  },

  closeButtonPressed: {
    opacity: 0.5,
  },

  close: {
    fontSize: 20,
    lineHeight: 20,
    color: "#94a3b8",
  },
});
