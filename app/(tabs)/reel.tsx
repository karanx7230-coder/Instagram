import { API } from "@/services/api";
import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type ApiUser = {
  id: string;
  username: string;
};

export default function Reel() {
  const [user, setUser] = useState<ApiUser[]>([]);
  const tabBarHeight = useBottomTabBarHeight();
  const fetchAllData = async () => {
    try {
      const userResponse = await API.get("/users");
      setUser(userResponse.data.users);
      // const postResponse = await API.get("/posts");
      // setPosts(postResponse.data.posts);
      // const imageResponse = await APIpic.get("/v2/list?page=16");
      // setImages(imageResponse.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderReel = ({ item }: { item: ApiUser }) => (
    <ImageBackground
      source={{ uri: `https://picsum.photos/600/600?.random=${item.id}` }}
      style={[styles.page, { height: SCREEN_HEIGHT - tabBarHeight }]}
    >
      <View style={styles.sideIcons}>
        <TouchableOpacity>
          <Feather name="heart" size={35} color={"white"} />
          <Text style={styles.iconText}>34</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/Comment.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>43</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/Messanger.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/Save.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/More.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfo}>
        <View style={styles.userRow}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/cry.png")}
          />
          <Text style={styles.username}>{item.username}</Text>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.caption}>
          Excepteur reprehenderit cillum aliquip ad enim Lorem labore mollit
          consequat elit est fugiat ut amet.
        </Text>
      </View>
    </ImageBackground>
  );

  return (
    <FlatList
      data={user}
      keyExtractor={(item) => item.id}
      renderItem={renderReel}
      showsVerticalScrollIndicator={false}
      pagingEnabled
      initialNumToRender={3}
      maxToRenderPerBatch={2}
      // snapToInterval={SCREEN_HEIGHT - tabBarHeight - insets.bottom}
      // getItemLayout={(_, index) => ({
      //   length: SCREEN_HEIGHT - tabBarHeight - insets.bottom,
      //   offset: (SCREEN_HEIGHT - tabBarHeight - insets.bottom) * index,
      //   index,
      // })}
      // contentContainerStyle={{ paddingBottom: tabBarHeight + insets.bottom }}
    />
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    justifyContent: "flex-end",
  },
  icon: {
    tintColor: "white",
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
  iconText: {
    color: "white",
    textAlign: "center",
  },
  sideIcons: {
    position: "absolute",
    right: 15,
    bottom: 20,
    gap: 20,
    alignItems: "center",
  },
  bottomInfo: {
    paddingBottom: 30,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  username: {
    color: "white",
    marginHorizontal: 10,
    fontWeight: "600",
  },
  followBtn: {
    paddingHorizontal: 15,
    height: 30,
    backgroundColor: "#ffffff36",
    justifyContent: "center",
    borderRadius: 5,
  },
  followText: {
    color: "white",
  },
  caption: {
    paddingHorizontal: 20,
    color: "white",
    width: "90%",
  },
});
