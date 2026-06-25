import { API, APIpic } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
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
      const imageResponse = await APIpic.get(`/v2/list?page=13`);
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
              resizeMode="cover"
              source={{
                uri:
                  images[index + 3]?.download_url ||
                  `https://picsum.photos/${index}`,
              }}
              style={homestyle.postprofileimg}
            />

            <TouchableOpacity style={homestyle.profileContainer}>
              <Text style={homestyle.postUsername}>{item.firstName}</Text>
              <Text style={homestyle.postLocation}>{item.address.city}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/More.png")}
              style={homestyle.iconimg}
            />
          </TouchableOpacity>
        </View>

        <Image
          resizeMode="cover"
          source={{
            uri:
              images[index]?.download_url || `https://picsum.photos/${index}`,
          }}
          style={homestyle.postImage}
        />
        <View style={homestyle.postbelowrow}>
          <View style={homestyle.iconRow}>
            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/Like.png")}
                style={homestyle.iconimg}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/Comment.png")}
                style={homestyle.iconimg}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/Messanger.png")}
                style={homestyle.iconimg}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Save.png")}
              style={homestyle.iconimg}
            />
          </TouchableOpacity>
        </View>

        <View style={homestyle.likesRow}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Inner Oval.png")}
            style={homestyle.likedByAvatar}
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

  const renderStoryItem = ({
    item,
    index,
  }: {
    item: ApiUser;
    index: number;
  }) => {
    return (
      <Pressable style={homestyle.storyContainer}>
        <LinearGradient
          colors={["#833ab4", "#e1306c", "#fcb045"]}
          style={homestyle.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            resizeMode="cover"
            source={{
              uri:
                images[index]?.download_url || `https://picsum.photos/${index}`,
            }}
            style={homestyle.storyimg}
          />
        </LinearGradient>
        <Text style={homestyle.usernameText} numberOfLines={1}>
          {item.firstName}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={homestyle.view}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"transparent"} />
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
        <View style={homestyle.iconRow}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/IGTV.png")}
            style={homestyle.iconimg}
          />
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Messanger.png")}
            style={homestyle.iconimg}
          />
        </View>
      </View>

      <View style={homestyle.divider} />

      <FlatList
        ListHeaderComponent={
          <View style={homestyle.headerWrapper}>
            <FlatList
              ListHeaderComponent={
                <TouchableOpacity style={homestyle.storyContainer}>
                  <LinearGradient
                    colors={["#833ab4", "#e1306c", "#fcb045"]}
                    style={homestyle.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image
                      resizeMode="contain"
                      source={{ uri: "https://picsum.photos/400" }}
                      style={homestyle.storyimg}
                    />
                  </LinearGradient>
                  <Text style={homestyle.usernameText} numberOfLines={1}>
                    username
                  </Text>
                </TouchableOpacity>
              }
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderStoryItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={homestyle.row}
            />
          </View>
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
    paddingHorizontal: 10,
    gap: 5,
  },
  storyContainer: {
    marginLeft: 6,
    alignItems: "center",
    width: 70,
    height: 80,
  },
  storyimg: {
    height: 70,
    width: 70,
    marginBottom: 5,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
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
    marginTop: 10,
  },
  iconimg: {
    height: 25,
    width: 25,
  },
  logo: {
    height: 33,
    marginLeft: 25,
    alignSelf: "center",
  },
  postprofileimg: {
    height: 35,
    width: 35,
    borderRadius: 17,
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
    height: 350,
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
  gradient: {
    height: 74,
    width: 74,
    borderRadius: 38,
    padding: 2,
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  likedByAvatar: {
    height: 25,
    width: 25,
  },
  divider: {
    height: 1,
    marginTop: 5,
    backgroundColor: "#c0c0c0",
    width: "100%",
  },
  headerWrapper: {
    paddingBottom: 10,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
});
