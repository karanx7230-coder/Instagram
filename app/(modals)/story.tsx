import { supabase } from "@/services/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
};
export default function Story() {
  const { image } = useLocalSearchParams<{ image: string }>();
  const [user, setUser] = useState<User | any>([]);

  const [loading, setLoading] = useState(true);

  const fetchStoryData = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const userresponse = data.user;
      console.log(user);
      console.log(image);
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url")
        .eq("id", userresponse?.id)
        .single();

      setUser({
        ...userresponse,
        username: profile?.username,
        name: profile?.full_name,
        bio: profile?.bio,
        avatar_url: profile?.avatar_url,
      });
    } catch (error) {
      console.log("Error fetching story data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoryData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
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

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          backgroundColor: "rgba(90, 90, 90, 0.3)",
        }}
      >
        <Image
          source={{ uri: user.avatar_url }}
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
            {user?.username}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
