import { useLocalSearchParams } from "expo-router";
import {  Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Story() {
  const { image, id, username, profileimg } = useLocalSearchParams<{
    image: string;
    id: string;
    username: string;
    profileimg: string;
  }>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
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

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          backgroundColor: "rgba(90, 90, 90, 0.3)",
        }}
      >
        <Image
          source={{ uri: profileimg }}
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
            {username}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
