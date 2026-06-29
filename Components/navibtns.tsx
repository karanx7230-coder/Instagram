import { router } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

export const Back = () => {
  return (
    <Pressable
      style={{
        height: 50,
        width: 50,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
      }}
      onPress={() => router.back()}
    >
      <Image
        source={require("../assets/images/Back.png")}
        resizeMode="contain"
      />
    </Pressable>
  );
};
export const Menu = () => {
  return (
    <Pressable
      style={{
        height: 50,
        width: 50,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
      }}
      // onPress={() => router.back()}
    >
      <Image
        source={require("../assets/images/Menu.png")}
        resizeMode="contain"
        style={{ height: 20, width: 20 }}
      />
    </Pressable>
  );
};
