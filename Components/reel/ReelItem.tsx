import {
  fetchLikeCount,
  hasUserLiked,
  likePost,
  unlikePost,
} from "@/services/posts";
import type { ReelItemProps } from "@/types/reel";
import { Feather } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReelItem({
  postId,
  currentUserId,
  imageUrl,
  caption,
  username,
  avatarUrl,
  location,
  itemHeight,
}: ReelItemProps) {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const [count, liked] = await Promise.all([
          fetchLikeCount(postId),
          currentUserId
            ? hasUserLiked(postId, currentUserId)
            : Promise.resolve(false),
        ]);
        setLikeCount(count);
        setIsLiked(liked);
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

    const { error } = originalIsLiked
      ? await unlikePost(postId, currentUserId)
      : await likePost(postId, currentUserId);

    if (error) {
      setIsLiked(originalIsLiked);
      setLikeCount(originalCount);
      Alert.alert("Error", "Couldn't sync like action.");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: imageUrl,
      }}
      style={[styles.page, { height: itemHeight }]}
    >
      <View style={styles.sideIcons}>
        <TouchableOpacity
          onPress={handleLikeToggle}
          accessibilityRole="button"
          accessibilityLabel={isLiked ? "Unlike reel" : "Like reel"}
        >
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
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Open comments"
        >
          <Image
            source={require("../../assets/images/Comment.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>23</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Share reel"
        >
          <Image
            source={require("../../assets/images/Messanger.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Save reel">
          <Image
            source={require("../../assets/images/Save.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <Image
            source={require("../../assets/images/More.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfo}>
        <View style={styles.userRow}>
          <ExpoImage
            style={styles.avatar}
            source={{ uri: avatarUrl }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <Text style={styles.username}>{username}</Text>
          <TouchableOpacity
            style={styles.followBtn}
            accessibilityRole="button"
            accessibilityLabel={`Follow ${username}`}
          >
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <Text numberOfLines={2} style={styles.caption}>
          {caption}
        </Text>
        {location ? <Text style={styles.viewsText}>{location}</Text> : null}
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
    backgroundColor: "#e9e9e9",
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
