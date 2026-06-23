import { API, APIpic } from "@/services/api";
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

type ApiUser = {
  id: number;
  firstName: string;
  image: string;
  address: { city: string };
};

type PicsumImage = {
  id: string;
  author: string;
  download_url: string;
};
export default function Index() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [images, setImages] = useState<PicsumImage[]>([]);

  const fetchAllData = async () => {
    try {
      const userResponse = await API.get("/users");
      setUsers(userResponse.data.users);
      const imageResponse = await APIpic.get(`/v2/list?page=7`);
      setImages(imageResponse.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  const renderpost = ({ item, index }: { item: ApiUser; index: number }) => {
    return (
      <View>
        <View style={homestyle.postHeader}>
          <View style={homestyle.postUserInfo}>
            <Image
              resizeMode="contain"
              source={{ uri: item.image }}
              style={homestyle.postprofileimg}
            />

            <TouchableOpacity style={homestyle.profileContainer}>
              <Text style={homestyle.postUsername}>{item.firstName}</Text>
              <Text style={homestyle.postLocation}>{item.address.city}</Text>
            </TouchableOpacity>
          </View>

          <Image
            resizeMode="contain"
            source={require("../../assets/images/More.png")}
          />
        </View>

        <Image
          resizeMode="cover"
          // resizeMode="contain"
          source={{
            uri: images[index]?.download_url || "https://picsum.photos/400",
          }}
          style={homestyle.postImage}
        />

        <View style={homestyle.postbelowrow}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Like.png")}
              style={homestyle.iconimg}
            />
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Comment.png")}
              style={homestyle.iconimg}
            />
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Messanger.png")}
              style={homestyle.iconimg}
            />
          </View>

          <Image
            resizeMode="contain"
            source={require("../../assets/images/Save.png")}
            style={homestyle.iconimg}
          />
        </View>

        <View style={homestyle.likesRow}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Inner Oval.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text>
            Liked by {item.firstName} and {item.id} others
          </Text>
        </View>

        <View style={homestyle.captionContainer}>
          <Text style={homestyle.captionText}>{item.address.city}</Text>
        </View>
      </View>
    );
  };
  const renderStoryItem = ({ item }: { item: ApiUser }) => {
    return (
      <View style={homestyle.storyContainer}>
        <Image
          resizeMode="contain"
          source={{ uri: item.image }}
          style={homestyle.storyimg}
        />
        <Text style={homestyle.usernameText} numberOfLines={1}>
          {item.firstName}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={homestyle.view}>
      <View style={homestyle.toprow}>
        <Image
          resizeMode="contain"
          source={require("../../assets/images/Camera Icon.png")}
          style={homestyle.iconimg}
        />
        <Image
          resizeMode="contain"
          source={require("../../assets/images/Instagram Logo.png")}
          style={homestyle.logo}
        />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Camera Icon.png")}
            style={homestyle.iconimg}
          />
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Messanger.png")}
            style={homestyle.iconimg}
          />
        </View>
      </View>
      <FlatList
        ListHeaderComponent={
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homestyle.row}
          />
        }
        data={users}
        renderItem={renderpost}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
const homestyle = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 5,
  },
  storyContainer: {
    alignItems: "center",
    width: 70,
  },
  storyimg: {
    height: 70,
    width: 70,
    marginBottom: 5,
    marginHorizontal: 10,
    borderWidth: 2,
    borderRadius: 35,
  },
  usernameText: {
    color: "grey",
    fontSize: 12,
  },
  toprow: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  iconimg: {
    height: 25,
    width: 25,
  },
  logo: {
    height: 30,
    alignSelf: "center",
  },

  postprofileimg: {
    height: 35,
    width: 35,
  },
  postbelowrow: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
  },
  postHeader: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  postUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileContainer: {
    marginHorizontal: 10,
  },

  postUsername: {
    fontSize: 13,
    fontWeight: "600",
  },

  postLocation: {
    fontSize: 12,
    color: "#666",
  },

  postImage: {
    width: "100%",
    height: 400,
  },

  likesRow: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 10,
    alignItems: "center",
  },

  captionContainer: {
    marginHorizontal: 10,
    marginTop: 5,
  },

  captionText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
