import PostItem from "@/app/screens/postItem";
import Homeloading from "@/Components/Skeletons/feedloading";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
type Post = {
  id: string;
  image_url: string;
  caption: string;
  location: string;
  user_id: string;
  aspect_ratio: number;
  profiles: {
    username: string;
    avatar_url: string;
  };
  likes: { count: number }[];
};
type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
};
type story = {
  id: string;
  image_url: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
};
export default function Index() {
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [story, setStory] = useState<story | any>([]);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        const { data: story, error: errorstory } = await supabase
          .from("story")
          .select("image_url,id,profiles(username, avatar_url)")
          .order("created_at", { ascending: false });
        setStory(story);
        if (errorstory) {
        }
        const { data: allPosts, error } = await supabase
          .from("posts")
          .select(
            "id, image_url, caption, location, user_id, aspect_ratio, profiles(username, avatar_url), likes(count)",
          )
          .order("created_at", { ascending: false });

        const { data: userLikes, error: userLikesError } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", user?.id);

        if (!userLikesError && userLikes) {
          setLikedPostIds(new Set(userLikes.map((l) => l.post_id)));
        }

        if (error) {
          console.log("posts fetch error", error);
          Alert.alert("heloo error agya he ");
        } else {
          setPosts((allPosts as any) ?? []);
        }
      } catch (error) {
        console.log("overall fetch error", error);
        Alert.alert("heloo error agya he ");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchdata();
    }
  }, [user?.id]);

  const renderPost = useCallback(({ item }: { item: Post }) => {
    return (
      <PostItem
        postId={item.id}
        currentUserId={user?.id ?? ""}
        imageUrl={item.image_url}
        caption={item.caption}
        username={item.profiles.username}
        avatarUrl={item.profiles.avatar_url}
        location={item.location}
        aspect={item.aspect_ratio}
        initialLikeCount={item.likes?.[0]?.count ?? 0}
        initialIsLiked={likedPostIds.has(item.id)}
      />
    );  
  }, [user?.id, likedPostIds]);
  const renderStoryItem = useCallback(({ item }: { item: story }) => {
    return (
      <Pressable
        onPress={() => {
          router.navigate({
            pathname: "/(modals)/story",
            params: {
              image: item.image_url,
              id: item.id,
              username: item.profiles.username,
              profileimg: item.profiles.avatar_url,
            },
          });
        }}
        style={homestyles.storyContainer}
      >
        <LinearGradient
          colors={["#833ab4", "#e1306c", "#fcb045"]}
          style={homestyles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            resizeMode="cover"
            source={{
              uri: item.profiles.avatar_url,
            }}
            style={homestyles.storyimg}
          />
        </LinearGradient>
        <Text style={homestyles.usernameText} numberOfLines={1}>
          {item.profiles.username}
        </Text>
      </Pressable>
    );
  }, []);
  if (loading || userLoading || !user) {
    return <Homeloading />;
  }
  return (
    <SafeAreaView style={homestyles.view} edges={["top"]}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"transparent"} />
      <View style={homestyles.toprow}>
        <TouchableOpacity onPress={() => router.navigate("/screens/addPost")}>
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          source={require("../../assets/images/Instagram Logo.png")}
          style={homestyles.logo}
        />

        <TouchableOpacity
          onPress={() => router.navigate("/screens/notification")}
        >
          <Feather name="heart" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <View>
            <FlatList
              ListHeaderComponent={
                <TouchableOpacity
                  style={homestyles.storyContainer}
                  onPress={() => router.navigate("/screens/addstory")}
                >
                  <View style={{ marginTop: 5 }}>
                    <Image
                      resizeMode="contain"
                      source={{ uri: user.avatar_url }}
                      style={homestyles.storyimg}
                    />
                    <View style={homestyles.plusIcon}>
                      <Feather name="plus" size={12} color="white" />
                    </View>
                  </View>
                  <Text style={homestyles.usernameText} numberOfLines={1}>
                    your story
                  </Text>
                </TouchableOpacity>
              }
              data={story}
              keyExtractor={(item) => item.id}
              renderItem={renderStoryItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={homestyles.row}
            />
          </View>
        }
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </SafeAreaView>
  );
}

const homestyles = StyleSheet.create({
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
    width: 86,
  },
  storyimg: {
    height: 80,
    width: 80,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 40,
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
  gradient: {
    height: 86,
    width: 86,
    borderRadius: 45,
    padding: 3,
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  likedByAvatar: {
    height: 25,
    width: 25,
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
  boldText: {
    fontWeight: "bold",
  },
  viewsText: {
    color: "#666",
    marginTop: 3,
  },
  plusIcon: {
    height: 22,
    width: 22,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    right: 0,
    backgroundColor: "#000000",
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "white",
  },
});
