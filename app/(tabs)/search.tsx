import { APIpic } from "@/services/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
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
export default function Search() {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const fetchUsers = async () => {
    try {
      const imageResponse = await APIpic.get(`/v2/list?page=2&limit=100`);
      setImages(imageResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const renderposts = ({ index }: { index: number }) => {
    return (
      <Image
        resizeMode="cover"
        source={{
          uri: images[index]?.download_url || `https://picsum.photos/${index}`,
        }}
        style={{
          height: 200,
          width: "33%",
          margin: "0.6%",
        }}
      />
    );
  };
  return (
    <SafeAreaView style={searchStyle.container}>
      <View>
        <TouchableOpacity
          style={searchStyle.searchInput}
          onPress={() => router.navigate("/screens/searchUser")}
        >
          <Text style={{ color: "#888", padding: 10 }}>Search by name...</Text>
        </TouchableOpacity>
        <FlatList
          data={images}
          keyExtractor={(item) => item.id}
          renderItem={renderposts}
          numColumns={3}
        />
      </View>
    </SafeAreaView>
  );
}

const searchStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  searchInput: {
    flexDirection: "row",
    height: 40,
    margin: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    fontSize: 16,
  },
});
