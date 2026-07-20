import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const SCREEN_HEIGHT = Dimensions.get("window").height;

type ReelItemProps = {
  postId: string;
  currentUserId: string;
  imageUrl: string;
  caption: string;
  username: string;
  avatarUrl: string;
  location?: string;
  aspect?: number;
};

export default function ReelItem({
  postId,
  currentUserId,
  imageUrl,
  caption,
  username,
  avatarUrl,
  location,
  aspect,
}: ReelItemProps) {
  const tabBarHeight = 60;
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const { count, error: countError } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        if (!countError) setLikeCount(count || 0);

        const { data: userLike, error: userLikeError } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", currentUserId)
          .maybeSingle();

        if (!userLikeError && userLike) {
          setIsLiked(true);
        }
      } catch (err) {
        console.log("Error fetching likes data:", err);
      }
    };

    fetchLikeData();
  }, [postId, currentUserId]);
  const handleLikeToggle = async () => {
    const originalIsLiked = isLiked;
    const originalCount = likeCount;
    setIsLiked(!originalIsLiked);
    setLikeCount(originalIsLiked ? originalCount - 1 : originalCount + 1);

    if (originalIsLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);

      if (error) {
        setIsLiked(originalIsLiked);
        setLikeCount(originalCount);
        Alert.alert("Error", "Couldn't sync unlike action.");
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: currentUserId });

      if (error) {
        setIsLiked(originalIsLiked);
        setLikeCount(originalCount);
        Alert.alert("Error", "Couldn't sync like action.");
      }
    }
  };
  return (
    <ImageBackground
      source={{
        uri: imageUrl,
      }}
      style={[styles.page, { height: SCREEN_HEIGHT - tabBarHeight }]}
    >
      <View style={styles.sideIcons}>
        <TouchableOpacity onPress={handleLikeToggle}>
          {isLiked ? (
            <Image
              resizeMode="contain"
              source={require("../../assets/images/redheart.png")}
              style={{
                height: 35,
                width: 35,
              }}
            />
          ) : (
            <Feather name="heart" size={35} color="white" />
          )}
          <Text style={styles.iconText}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/Comment.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>23</Text>
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
              uri: avatarUrl,
            }}
          />
          <Text style={styles.username}>{username}</Text>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <Text numberOfLines={2} style={styles.caption}></Text>
        <Text style={styles.viewsText}>
          64views
          {caption}
        </Text>
      </View>
    </ImageBackground>
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
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
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
