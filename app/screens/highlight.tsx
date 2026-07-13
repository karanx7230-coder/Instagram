import { supabase } from "@/services/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
};

type story = {
  id: string;
  image_url: string;
};
export default function highlight() {
  const { image } = useLocalSearchParams<{ image: string }>();
  const [highlight, setHighlight] = useState<story | any>([]);
  const [user, setUser] = useState<User | any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchStoryData = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url")
        .eq("id", user)
        .single();
      console.log(profile);

      const { data: story } = await supabase
        .from("story")
        .select("id, image_url")
        .eq("user_id", user)
        .order("created_at", { ascending: false });

      console.log(story);

      setHighlight(story ?? []);
      setUser({
        username: profile?.username,
        name: profile?.full_name,
        bio: profile?.bio,
        avatar_url: profile?.avatar_url,
      });
    } catch (error) {
      console.log("Error fetching story data:", error);
    }
  };

  useEffect(() => {
    fetchStoryData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {image && (
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
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          backgroundColor: "rgba(90, 90, 90, 0.3)",
        }}
      >
        <Image
          //   source={{uri:}}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#fff",
          }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
          ></Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
