import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Post = {
  id: string;
  image_url: string;
  caption: string;
  location: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
};
const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3;

export default function Search() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data: allPosts, error } = await supabase
          .from("posts")
          .select(
            "id, image_url, caption, location, user_id, profiles(username, avatar_url)",
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.log("posts fetch error", error);
        } else {
          setPosts((allPosts as any) ?? []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const renderPosts = ({ item }: { item: Post }) => {
    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/screens/searchpost",
            params: { postId: item.id },
          });
        }}
      >
        <Image
          resizeMode="cover"
          source={{
            uri: item.image_url,
          }}
          style={searchStyle.image}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={searchStyle.container} edges={["top"]}>
      <View style={searchStyle.header}>
        <TouchableOpacity
          style={searchStyle.searchInput}
          onPress={() => router.navigate("/screens/searchUser")}
        >
          <Text style={searchStyle.searchText}>Search by name...</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={searchStyle.loader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPosts}
          numColumns={3}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70 }}
        />
      )}
    </SafeAreaView>
  );
}

const searchStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  searchInput: {
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
  },

  searchText: {
    color: "#888",
    paddingHorizontal: 10,
    fontSize: 16,
  },

  image: {
    width: imageSize,
    height: imageSize,
    backgroundColor: "#eee",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
