import { useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Highlight() {
  const { image, name, profile } = useLocalSearchParams<{
    image: string;
    name: string;
    profile: string;
  }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.8,
          }}
          resizeMode="cover"
        />
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          backgroundColor: "rgba(90, 90, 90, 0.3)",
        }}
      >
        <Image
          source={{ uri: profile }}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#fff",
          }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {name}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
