import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
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

type PostItemProps = {
  postId: string;
  currentUserId: string;
  imageUrl: string;
  caption: string;
  username: string;
  avatarUrl: string;
  location?: string;
  aspect?: number;
  initialLikeCount: number;
  initialIsLiked: boolean;
};
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
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);

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
    <View>
      <View style={postitemstyles.postHeader}>
        <View style={postitemstyles.postUserInfo}>
          <Image
            resizeMode="cover"
            source={{ uri: avatarUrl }}
            style={postitemstyles.postprofileimg}
          />
          <TouchableOpacity style={postitemstyles.profileContainer}>
            <Text style={postitemstyles.postUsername}>{username}</Text>
            <Text style={postitemstyles.postlocation}>{location}</Text>
          </TouchableOpacity>
        </View>
        <View style={postitemstyles.followMoreRow}>
          <TouchableOpacity style={postitemstyles.followButton}>
            <Text>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather
              name="more-vertical"
              size={20}
              color="black"
              style={{ top: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Image
        resizeMode="cover"
        source={{ uri: imageUrl }}
        style={[
          postitemstyles.postImage,
          {
            aspectRatio: aspect ? aspect : 0.9,
            height: undefined,
          },
        ]}
      />

      <View style={postitemstyles.postbelowrow}>
        <View style={postitemstyles.iconRow}>
          <TouchableOpacity onPress={handleLikeToggle}>
            {isLiked ? (
              <Image
                resizeMode="contain"
                source={require("../../assets/images/redheart.png")}
                style={[postitemstyles.iconimg]}
              />
            ) : (
              <Feather name="heart" size={25} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.navigate({
                pathname: "/(modals)/comments",
                params: { userId: postId },
              });
            }}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Comment.png")}
              style={postitemstyles.iconimg}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/Messanger.png")}
              style={postitemstyles.iconimg}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Feather name="bookmark" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={postitemstyles.likesRow}>
        <Text style={postitemstyles.likesText}>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </Text>
      </View>

      <View style={postitemstyles.captionContainer}>
        <Text numberOfLines={2} style={postitemstyles.captionText}>
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
  },
  profileContainer: {
    marginHorizontal: 10,
  },
  postUsername: {
    fontSize: 13,
    fontWeight: "600",
    color: "black",
  },
  postlocation: {
    fontSize: 11,
    fontWeight: "200",
    color: "grey",
  },
  postImage: {
    width: "100%",
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
