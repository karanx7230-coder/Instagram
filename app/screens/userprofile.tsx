import { Back, Menu } from "@/Components/navibtns";
import ProfileLoading from "@/Components/Skeletons/profileLoading";
import { supabase } from "@/services/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
};

type Post = {
  id: string;
  image_url: string;
};

type Highlight = {
  id: string;
  image_url: string;
};

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "mentions">("posts");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [highlight, setHighlight] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);

  // follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const myId = authData.user?.id ?? null;
      setCurrentUserId(myId);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, full_name, bio, avatar_url")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.log("profile fetch error", profileError);
      } else {
        setProfile(profileData);
      }

      const { data: userPosts, error: postsError } = await supabase
        .from("posts")
        .select("id, image_url")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.log("posts fetch error", postsError);
      } else {
        setPosts(userPosts ?? []);
      }

      const { data: highlightData, error: highlightError } = await supabase
        .from("highlight")
        .select("id, image_url")
        .eq("user_id", userId)
        .order("created_at");

      if (highlightError) {
        console.log("highlight fetch error", highlightError);
      } else {
        setHighlight(highlightData ?? []);
      }

      if (myId && myId !== userId) {
        const { data: followData } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", myId)
          .eq("following_id", userId)
          .maybeSingle();

        setIsFollowing(!!followData);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !userId) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", userId);

        if (!error) setIsFollowing(false);
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: currentUserId, following_id: userId });

        if (!error) setIsFollowing(true);
      }
    } catch (err) {
      console.log("follow toggle error", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return <ProfileLoading />;
  }

  return (
    <SafeAreaView style={profilestyles.safeArea}>
      <View style={profilestyles.flexOne}>
        <FlatList
          ListHeaderComponent={
            <View>
              <View style={profilestyles.topNav}>
                <Back />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  {profile?.username}
                </Text>
                <Menu />
              </View>

              <View style={profilestyles.profileSection}>
                <View style={profilestyles.avatarStatsRow}>
                  <View style={profilestyles.avatarBorder}>
                    <Image
                      source={
                        profile?.avatar_url
                          ? { uri: profile.avatar_url }
                          : require("../../assets/images/cry.png")
                      }
                      style={profilestyles.avatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        margin: 10,
                        marginLeft: 20,
                      }}
                    >
                      {profile?.full_name}
                    </Text>
                    <View style={profilestyles.statsRow}>
                      <View>
                        <Text>59</Text>
                        <Text>followers</Text>
                      </View>
                      <View>
                        <Text>59</Text>
                        <Text>following</Text>
                      </View>
                      <View>
                        <Text>{posts.length}</Text>
                        <Text>posts</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View>
                  <Text>{profile?.bio}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    profilestyles.editProfileButton,
                    isFollowing && profilestyles.followingButton,
                  ]}
                  onPress={handleFollowToggle}
                  disabled={followLoading}
                >
                  <Text
                    style={isFollowing ? { color: "#000" } : { color: "#fff" }}
                  >
                    {followLoading
                      ? "..."
                      : isFollowing
                        ? "Following"
                        : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={profilestyles.storiesRow}
              >
                {highlight.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/highlight",
                        params: {
                          image: item.image_url,
                          name: profile?.username,
                          profile: profile?.avatar_url,
                        },
                      })
                    }
                  >
                    <LinearGradient
                      colors={["#833ab4", "#e1306c", "#fcb045"]}
                      style={profilestyles.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Image
                        source={{ uri: item.image_url }}
                        resizeMode="cover"
                        style={profilestyles.highlightImage}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={profilestyles.tabsRow}>
                <TouchableOpacity
                  style={[
                    profilestyles.tabButton,
                    {
                      borderBottomColor:
                        activeTab === "posts" ? "#000" : "transparent",
                    },
                  ]}
                  onPress={() => setActiveTab("posts")}
                >
                  <Image
                    source={require("../../assets/images/Grid Icon (1).png")}
                    style={[
                      profilestyles.tabIcon,
                      {
                        tintColor:
                          activeTab === "posts" ? "#000000" : "#888888",
                      },
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    profilestyles.tabButton,
                    {
                      borderBottomColor:
                        activeTab === "mentions" ? "#000" : "transparent",
                    },
                  ]}
                  onPress={() => setActiveTab("mentions")}
                >
                  <Image
                    source={require("../../assets/images/Tags Icon (1).png")}
                    style={[
                      profilestyles.tabIcon,
                      {
                        tintColor: activeTab === "mentions" ? "#000" : "#888",
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
          data={activeTab === "posts" ? posts : []}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={{ width: "33%", margin: 1 }}
              onPress={() => {
                router.push({
                  pathname: "/screens/posts",
                  params: { userId: userId, postId: item.id },
                });
              }}
            >
              <Image
                source={{ uri: item.image_url }}
                resizeMode="cover"
                style={profilestyles.gridImage}
              />
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const profilestyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  flexOne: { flex: 1 },
  topNav: { flexDirection: "row", justifyContent: "space-between" },
  profileSection: { marginHorizontal: 20 },
  avatarStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  avatarBorder: { alignItems: "center", justifyContent: "center" },
  avatarImage: {
    height: 90,
    width: 90,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignSelf: "center",
    gap: 30,
  },
  editProfileButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderRadius: 4,
    height: 30,
    backgroundColor: "#3797EF",
  },
  followingButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#dbdbdb",
  },
  storiesRow: { flexDirection: "row", width: "100%", margin: 10, gap: 10 },
  gradient: {
    height: 70,
    width: 70,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  highlightImage: {
    height: 65,
    backgroundColor: "white",
    width: 65,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "white",
  },
  tabsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  tabIcon: { width: 24, height: 24 },
  gridImage: { height: 150, width: "100%" },
});
