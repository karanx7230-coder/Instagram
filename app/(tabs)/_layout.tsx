import { Tabs } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 75,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Home.png")}
              style={style.img}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Search.png")}
              style={style.img}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reel"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/reel.png")}
              style={style.img}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messeges"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Messanger.png")}
              style={style.img}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/profile.png")}
              style={style.img}
            />
          ),
        }}
      />
    </Tabs>
  );
}
const style = StyleSheet.create({
  img: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
});
