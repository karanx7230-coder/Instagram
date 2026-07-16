import Homeloading from "@/Components/Skeletons/feedloading";
import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

type You = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
};
type Post = {
  id: string;
  image_url: string;
  caption: string;
  location: string;
};

type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
};
type story = {
  id: string;
  image_url: string;
};
export default function Index() {
  const [you, setYou] = useState<You | any>([]);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | any>([]);
  const [story, setStory] = useState<story | any>([]);

  // const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchdata = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const userresponse = data.user;
      console.log("this is user", userresponse);
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url")
        .eq("id", userresponse?.id)
        .single();
      console.log("this is profile", profile);
      const { data: story } = await supabase
        .from("story")
        .select("image_url,id")
        .eq("user_id", userresponse?.id)
        .order("created_at", { ascending: false });
      console.log("yeh stiry he", story);
      setStory(story);
      const { data: userPosts, error } = await supabase
        .from("posts")
        .select("id, image_url,caption,location")
        .eq("user_id", userresponse?.id)
        .order("created_at", { ascending: false })
      console.log("posta a ", userPosts);

      if (error) {
        console.log("posts fetch error", error);
      } else {
        setPosts(userPosts ?? []);
      }
      setUser({
        ...userresponse,
        username: profile?.username,
        name: profile?.full_name,
        bio: profile?.bio,
        avatar_url: profile?.avatar_url,
      });
    } catch (error) {
      console.log("erroror a gyaaa ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  if (loading) {
    return <Homeloading />;
  }
  const renderPost = ({ item }: { item: Post }) => {
    return (
      <View>
        <View style={homestyles.postHeader}>
          <View style={homestyles.postUserInfo}>
            <Image
              resizeMode="cover"
              source={{
                uri: user?.avatar_url,
              }}
              style={homestyles.postprofileimg}
            />

            <TouchableOpacity style={homestyles.profileContainer}>
              <Text style={homestyles.postUsername}>{user.username}</Text>
              <Text style={homestyles.postLocation}></Text>
            </TouchableOpacity>
          </View>
          <View style={homestyles.followMoreRow}>
            <TouchableOpacity style={homestyles.followButton}>
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
          source={{
            uri: item.image_url,
          }}
          style={homestyles.postImage}
        />
        <View style={homestyles.postbelowrow}>
          <View style={homestyles.iconRow}>
            <TouchableOpacity>
              <Feather name="heart" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.navigate({
                  pathname: "/(modals)/comments",
                  params: { userId: item.id },
                });
              }}
            >
              <Image
                resizeMode="contain"
                source={require("../../assets/images/Comment.png")}
                style={homestyles.iconimg}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/Messanger.png")}
                style={homestyles.iconimg}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Feather name="bookmark" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={homestyles.likesRow}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Inner Oval.png")}
            style={homestyles.likedByAvatar}
          />
          <Text>Liked by {user.firstName} and 2345 others</Text>
        </View>

        <View style={homestyles.captionContainer}>
          <Text numberOfLines={2} style={homestyles.captionText}>
            <Text style={homestyles.boldText}>{user.firstName}</Text>
            {"  "}
            {item.caption}
          </Text>
          <Text style={homestyles.viewsText}>
            {(1000 + Math.random() * 100).toFixed(0)} views
          </Text>
        </View>
      </View>
    );
  };

  const renderStoryItem = ({ item }: { item: story }) => {
    return (
      <Pressable
        onPress={() => {
          router.navigate({
            pathname: "/(modals)/story",
            params: { image: item.image_url },
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
              uri: item.image_url,
            }}
            style={homestyles.storyimg}
          />
        </LinearGradient>
        <Text style={homestyles.usernameText} numberOfLines={1}>
          {/* {item.id} */}
        </Text>
      </Pressable>
    );
  };
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
                  {/* <LinearGradient
                    colors={["#833ab4", "#e1306c", "#fcb045"]}
                    style={homestyles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  > */}
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
                  {/* </LinearGradient> */}
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
        contentContainerStyle={{ paddingBottom: 70 }}
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
