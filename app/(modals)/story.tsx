import { API, APIpic } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  PanResponder,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ApiUser = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  image: string;
  address: {
    city: string;
    stateCode: string;
  };
};
export default function Story() {
  const userId = Number(useLocalSearchParams().userId);

  const [user, setUser] = useState<ApiUser | null>(null);
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStoryData = async () => {
    try {
      setLoading(true);

      const userResponse = await API.get(`/users/${userId}`);
      setUser(userResponse.data);

      const imageResponse = await APIpic.get(`/id/${userId + 1}/info`).catch(
        () => null,
      );

      if (imageResponse && imageResponse.data) {
        setStoryImage(imageResponse.data.download_url);
      } else {
        setStoryImage(`https://picsum.photos/id/${userId}/500/800`);
      }
    } catch (error) {
      console.log("Error fetching story data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStoryData();
    }
  }, [userId]);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          router.back();
        }
      },
    }),
  ).current;

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#000" }}
      {...panResponder.panHandlers}
    >
      {storyImage && (
        <Image
          source={{ uri: storyImage }}
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
          source={{
            uri: `https://dummyjson.com/icon/${userId}/150`,
          }}
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
            {user ? `${user.firstName} ${user.lastName}` : `User ${userId}`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
