import { useUser } from "@/context/UserContext";
import { Tabs } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function RootLayout() {
  const { user } = useUser();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,

        tabBarStyle: {
          height: 60,
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/Home.png")}
              style={[style.img, { opacity: focused ? 1 : 0.8 }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reel"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/reel.png")}
              style={[style.img, { opacity: focused ? 1 : 0.6 }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/Messanger.png")}
              style={[style.img, { opacity: focused ? 1 : 0.6 }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/Search.png")}
              style={[style.img, { opacity: focused ? 1 : 0.6 }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                user?.avatar_url
                  ? { uri: user.avatar_url }
                  : require("../../assets/images/cry.png")
              }
              style={[
                style.img,
                { borderRadius: 11, opacity: focused ? 1 : 0.75 },
              ]}
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
