import { Text, View } from "react-native";

export default function NewPost() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "skyblue",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#d70202",
          fontSize: 40,
          width: "80%",
          textAlign: "center",
        }}
      >
        feature available in the next update
      </Text>
    </View>
  );
}
