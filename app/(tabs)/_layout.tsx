import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 75,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "home",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Home.png")}
              style={{ height: 22, width: 22 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Search.png")}
              style={{ height: 22, width: 22 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="newPost"
        options={{
          title: "addpost",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Add Story.png")}
              style={{
                height: 22,
                width: 22,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifiaction",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Like.png")}
              style={{ height: 22, width: 22 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/Inner Oval.png")}
              style={{ height: 22, width: 22 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
