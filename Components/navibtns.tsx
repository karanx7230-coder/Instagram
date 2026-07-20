import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

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
      <Feather name="arrow-left" size={24} color="black" />
    </Pressable>
  );
};
export const Menu = () => {
  return (
    <Pressable
      onPress={() => router.push("/screens/setting")}
      style={{
        height: 50,
        width: 50,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
      }}
    >
      <Feather name="menu" size={25} color="black" />
    </Pressable>
  );
};
