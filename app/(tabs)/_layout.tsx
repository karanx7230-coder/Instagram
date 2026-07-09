import { supabase } from "@/services/supabase";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
type You = {
  id: string;
  avatar_url: string;
};
export default function RootLayout() {
  const [you, setYou] = useState<You | any>([]);

  const fetchuser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const userresponse = data.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url")
        .eq("id", userresponse?.id)
        .single();

      setYou({
        ...userresponse,
        username: profile?.username,
        name: profile?.full_name,
        bio: profile?.bio,
        avatar_url: profile?.avatar_url,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchuser();
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 60,
          borderTopWidth: 0.4,
          borderTopColor: "#d9d9d9",
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/Home.png")}
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
        name="messeges"
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
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                you.avatar_url
                  ? { uri: you.avatar_url }
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
