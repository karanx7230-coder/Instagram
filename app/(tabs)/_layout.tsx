import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Tabs } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function RootLayout() {
  const { user } = useUser();
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,

        tabBarStyle: {
          height: 60,
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "Home feed",
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
          tabBarAccessibilityLabel: "Reels",
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
          tabBarAccessibilityLabel: "Messages",
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
          tabBarAccessibilityLabel: "Search",
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
          tabBarAccessibilityLabel: "Your profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                user?.avatar_url
                  ? { uri: user.avatar_url }
                  : require("../../assets/images/cry_fixed.png")
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
