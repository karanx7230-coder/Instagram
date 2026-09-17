import { Pressable, StyleSheet, Text, View } from "react-native";

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        style={styles.button}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading"
      >
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0095f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
