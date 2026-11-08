import ActionButton from "@/components/ui/ActionButton";
import { colors } from "@/features/posts/styles";
import { IPaginationProps } from "@/interfaces/ui/IUiPagination";
import { StyleSheet, Text, View } from "react-native";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <View accessibilityLabel="Paginação" style={styles.container}>
      <View style={styles.cell}>
        <ActionButton
          disabled={currentPage === 1}
          label="Anterior"
          onPress={() => onPageChange(currentPage - 1)}
          variant="secondary"
        />
      </View>

      <Text style={styles.status}>
        {currentPage} de {totalPages}
      </Text>

      <View style={styles.cell}>
        <ActionButton
          disabled={currentPage === totalPages}
          label="Próxima"
          onPress={() => onPageChange(currentPage + 1)}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  cell: {
    flex: 1,
  },
  status: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "700",
  },
});
