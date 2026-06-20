import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#833ab4", "#e1306c", "#fcb045"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Image
        source={require("../assets/images/logo.png")}
        resizeMode="contain"
      />
      <Text style={{ color: "black", margin: 20, fontSize: 17 }}>Instgram</Text>
      <View style={{ flexDirection: "row", top: "20%" }}>
        <Image
          source={require("../assets/images/meta.png")}
          resizeMode="contain"
          style={{ height: 20, width: 20, marginHorizontal: 10 }}
        />
        <Text>Meta</Text>
      </View>
    </LinearGradient>
  );
}
