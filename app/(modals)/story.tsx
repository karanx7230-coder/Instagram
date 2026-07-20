import { supabase } from "@/services/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Story() {
  const { image, id, username, profileimg } = useLocalSearchParams<{
    image: string;
    id: string;
    username: string;
    profileimg: string;
  }>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        setLoading(true);

        await supabase
          .from("profiles")

          .select("username, full_name, bio, avatar_url")
          .eq("id", id)
          .single();
      } catch (error) {
        console.log("Error fetching story data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryData();
  }, [id]);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={"blue"} />
      </View>
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
          source={{ uri: profileimg }}
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
            {username}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
