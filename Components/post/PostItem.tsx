import { useTheme } from "@/context/ThemeContext";
import { likePost, unlikePost } from "@/services/posts";
import type { PostItemProps } from "@/types/post";
import { Feather } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function PostItem({
  postId,
  currentUserId,
  imageUrl,
  caption,
  username,
  avatarUrl,
  location,
  aspect,
  initialLikeCount,
  initialIsLiked,
}: PostItemProps) {
  const { theme } = useTheme();
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);

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
    <View style={{ backgroundColor: theme.card }}>
      <View style={postitemstyles.postHeader}>
        <View style={postitemstyles.postUserInfo}>
          <ExpoImage
            source={{ uri: avatarUrl }}
            style={postitemstyles.postprofileimg}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <TouchableOpacity
            style={postitemstyles.profileContainer}
            accessibilityRole="button"
            accessibilityLabel={`Open profile of ${username}`}
          >
            <Text style={[postitemstyles.postUsername, { color: theme.text }]}>
              {username}
            </Text>
            <Text style={[postitemstyles.postlocation, { color: theme.muted }]}>
              {location}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={postitemstyles.followMoreRow}>
          <TouchableOpacity
            style={postitemstyles.followButton}
            accessibilityRole="button"
            accessibilityLabel={`Follow ${username}`}
          >
            <Text>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <Feather
              name="more-vertical"
              size={20}
              color={theme.text}
              style={{ top: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ExpoImage
        source={{ uri: imageUrl }}
        style={[
          postitemstyles.postImage,
          {
            aspectRatio: aspect ? aspect : 0.9,
            height: undefined,
          },
        ]}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={postId}
      />

      <View style={postitemstyles.postbelowrow}>
        <View style={postitemstyles.iconRow}>
          <TouchableOpacity
            onPress={handleLikeToggle}
            accessibilityRole="button"
            accessibilityLabel={isLiked ? "Unlike post" : "Like post"}
          >
            {isLiked ? (
              <Image
                resizeMode="contain"
                source={require("../../assets/images/redheart.png")}
                style={[postitemstyles.iconimg]}
              />
            ) : (
              <Feather name="heart" size={25} color={theme.text} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.navigate({
                pathname: "/(modals)/comments",
                params: { userId: postId },
              });
            }}
            accessibilityRole="button"
            accessibilityLabel="Open comments"
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Comment.png")}
              style={postitemstyles.iconimg}
            />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Share post"
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Messanger.png")}
              style={postitemstyles.iconimg}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Save post"
        >
          <Feather name="bookmark" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={postitemstyles.likesRow}>
        <Text style={[postitemstyles.likesText, { color: theme.text }]}>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </Text>
      </View>

      <View style={postitemstyles.captionContainer}>
        <Text
          numberOfLines={2}
          style={[postitemstyles.captionText, { color: theme.text }]}
        >
          <Text style={postitemstyles.boldText}>{username}</Text>
          {caption}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(PostItem);

const postitemstyles = StyleSheet.create({
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
  postprofileimg: {
    height: 35,
    width: 35,
    borderRadius: 17,
    backgroundColor: "#e9e9e9",
  },
  profileContainer: {
    marginHorizontal: 10,
  },
  postUsername: {
    fontSize: 13,
    fontWeight: "600",
  },
  postlocation: {
    fontSize: 11,
    fontWeight: "200",
  },
  postImage: {
    width: "100%",
    backgroundColor: "#e9e9e9",
  },
  postbelowrow: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  iconimg: {
    height: 25,
    width: 25,
  },
  likesRow: {
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "center",
  },
  likesText: {
    fontWeight: "600",
    fontSize: 13,
  },
  captionContainer: {
    marginHorizontal: 10,
    marginTop: 5,
  },
  captionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "bold",
  },
  followMoreRow: {
    flexDirection: "row",
  },
  followButton: {
    marginHorizontal: 10,
    paddingHorizontal: 15,
    height: 30,
    backgroundColor: "#e9e9e9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});
