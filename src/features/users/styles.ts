import { colors } from "@/features/posts/styles";
import { StyleSheet } from "react-native";

export const teacherUsersHomeStyles = StyleSheet.create({
  header: {
    gap: 6,
  },
  backLink: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
  },
});

export const teacherUsersStyles = StyleSheet.create({
  header: {
    gap: 14,
  },
  backLink: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "700",
  },
  summary: {
    color: colors.muted,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: colors.redLight,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  errorText: {
    color: colors.red,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  userName: {
    flex: 1,
    color: colors.ink,
    fontSize: 17,
    fontWeight: "700",
  },
  userMeta: {
    color: colors.muted,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopColor: "#e2e8f0",
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingRight: 20,
  },
  actionLabel: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "700",
  },
  danger: {
    color: colors.red,
  },
});

export const teacherUserFormStyles = StyleSheet.create({
  page: {
    flex: 1,
  },
  loadError: {
    margin: 20,
  },
  headingBlock: {
    gap: 6,
  },
  heading: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    lineHeight: 19,
  },
  buttons: {
    gap: 10,
    borderTopColor: "#e2e8f0",
    borderTopWidth: 1,
    paddingTop: 12,
  },
});
