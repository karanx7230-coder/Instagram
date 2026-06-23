import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
    </Tabs>
  );
}
