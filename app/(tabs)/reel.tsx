import Reelloading from "@/Components/Skeletons/reelLoading";
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
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type ApiUser = {
  id: string;
  username: string;
};
type ApiPost = {
  id: number;
  body: string;
  title: string;
  userId: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  tags: string[];
};
type PicsumImage = {
  download_url: string;
};

export default function Reel() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [loading, setLoading] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchAllData = async () => {
    setLoading(true);
    try {
    
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return <Reelloading />;
  }

  const renderReel = ({ item, index }: { item: ApiPost; index: number }) => {
    const user = users[index];

    return (
      <ImageBackground
        source={{
          uri:
            images[index]?.download_url ||
            `https://picsum.photos/600/600?.random=${item.id}`,
        }}
        style={[styles.page, { height: SCREEN_HEIGHT - tabBarHeight }]}
      >
        <View style={styles.sideIcons}>
          <TouchableOpacity>
            <Feather name="heart" size={35} color={"white"} />
            <Text style={styles.iconText}>{item.reactions.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/Comment.png")}
              style={styles.icon}
            />
            <Text style={styles.iconText}>{item.reactions.dislikes}</Text>
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
              source={{
                uri:
                  images[index]?.download_url ||
                  `https://picsum.photos/600/600?.random=${item.id}`,
              }}
            />
            <Text style={styles.username}>{user.username}</Text>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <Text numberOfLines={2} style={styles.caption}>
            {item.body}
          </Text>
          <Text style={styles.viewsText}>
            {item.views.toLocaleString()} views #{item?.tags[0]}, #
            {item?.tags[1]}, #{item?.tags[2]},
          </Text>
        </View>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView style={{ height: SCREEN_HEIGHT - tabBarHeight }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReel}
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT - tabBarHeight}
        snapToAlignment="end"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT - tabBarHeight,
          offset: (SCREEN_HEIGHT - tabBarHeight) * index,
          index,
        })}
      />
    </SafeAreaView>
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
    paddingBottom: 10,
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
  viewsText: {
    paddingHorizontal: 20,
    color: "#dddddd",
    marginTop: 6,
    fontSize: 12,
  },
});
