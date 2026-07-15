import { supabase } from "@/services/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// type User = {
//   id: string;
//   email: string;
//   username: string;
//   name: string;
//   bio: string;
//   avatar_url: string;
// };

// type story = {
//   id: string;
//   image_url: string;
// };
export default function highlight() {
  const { image, name, profile } = useLocalSearchParams<{
    image: string;
    name: string;
    profile: string;
  }>();
  // const [user, setUser] = useState<User | any>([]);

  // const fetchStoryData = async () => {
  //   try {
  //     const { data } = await supabase.auth.getUser();
  //     const userresponse = data.user;

  //     const { data: profile } = await supabase
  //       .from("profiles")
  //       .select("username, full_name, bio, avatar_url")
  //       .eq("id", userresponse?.id)
  //       .single();
  //     setUser({
  //       ...userresponse,
  //       username: profile?.username,
  //       name: profile?.full_name,
  //       bio: profile?.bio,
  //       avatar_url: profile?.avatar_url,
  //     });
  //     const { data: story } = await supabase
  //       .from("story")
  //       .select("id, image_url")
  //       .eq("user_id", userresponse?.id)
  //       .order("created_at", { ascending: true });

  //     console.log(story);
  //     console.log(profile);
  //     console.log(userresponse);
  //     console.log(user);
  //   } catch (error) {
  //     console.log("Error fetching story data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchStoryData();
  // }, []);

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
          source={{ uri: profile }}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#fff",
          }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {name}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
