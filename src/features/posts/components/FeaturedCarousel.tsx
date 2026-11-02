import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, type ComponentRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { IFeaturedCarouselProps } from "@/interfaces/ui/IUiPosts";
import PostCard from "./PostCard";

export default function FeaturedCarousel({ posts }: IFeaturedCarouselProps) {
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const activeIndex = Math.max(0, Math.min(index, posts.length - 1));

  function goTo(next: number) {
    scroll.current?.scrollTo({ x: next * width, animated: true });
    setIndex(next);
  }

  if (!posts.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title} accessibilityRole="header">
          Em destaque
        </Text>
        {posts.length > 1 ? (
          <View style={styles.controls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Destaque anterior"
              disabled={activeIndex === 0}
              onPress={() => goTo(activeIndex - 1)}
              style={[styles.button, activeIndex === 0 && styles.disabled]}
            >
              <Ionicons name="chevron-back" size={20} color="#0F766E" />
            </Pressable>
            <Text style={styles.counter}>
              {activeIndex + 1} / {posts.length}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Próximo destaque"
              disabled={activeIndex === posts.length - 1}
              onPress={() => goTo(activeIndex + 1)}
              style={[
                styles.button,
                activeIndex === posts.length - 1 && styles.disabled,
              ]}
            >
              <Ionicons name="chevron-forward" size={20} color="#0F766E" />
            </Pressable>
          </View>
        ) : null}
      </View>
      <View
        onLayout={(event) => {
          const nextWidth = event.nativeEvent.layout.width;
          setWidth(nextWidth);
          scroll.current?.scrollTo({
            x: activeIndex * nextWidth,
            animated: false,
          });
        }}
      >
        {width > 0 ? (
          <ScrollView
            ref={scroll}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={32}
            onScroll={(event) =>
              setIndex(Math.round(event.nativeEvent.contentOffset.x / width))
            }
          >
            {posts.map((post) => (
              <View key={post._id} style={{ width }}>
                <PostCard post={post} />
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, marginTop: 8 },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  title: { color: "#0F172A", fontSize: 20, fontWeight: "700" },
  controls: { flexDirection: "row", alignItems: "center", gap: 6 },
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8FAF6",
    borderRadius: 22,
  },
  disabled: { opacity: 0.35 },
  counter: { color: "#64748B", fontSize: 12 },
});
