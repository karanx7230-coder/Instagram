import { APIpic } from "@/services/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PicsumImage = {
  id: string;
  author: string;
  download_url: string;
};

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3;

export default function Search() {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const imageResponse = await APIpic.get("/v2/list?page=2&limit=100");
      setImages(imageResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const renderPosts = ({ item }: { item: PicsumImage }) => {
    return (
      <Image
        resizeMode="cover"
        source={{
          uri: item.download_url,
        }}
        style={searchStyle.image}
      />
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
          data={images}
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
