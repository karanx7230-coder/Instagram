import { Back, Menu } from "@/Components/navibtns";
import ProfileLoading from "@/Components/Skeletons/profileLoading";
import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

type User = {
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
};
type highlight = {
  id: string;
  image_url: string;
};
export default function Profile() {
  const [activeTab, setActiveTab] = useState<"posts" | "mentions">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | any>([]);
  const [highlight, setHighlight] = useState<highlight[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        const userresponse = data.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, bio, avatar_url")
          .eq("id", userresponse?.id)
          .single();
        const { data: Highlight } = await supabase
          .from("highlight")
          .select("image_url,id")
          .eq("user_id", userresponse?.id)
          .order("created_at");

        setHighlight((Highlight as any) ?? []);
        const { data: userPosts, error } = await supabase
          .from("posts")
          .select("id, image_url")
          .eq("user_id", userresponse?.id)
          .order("created_at", { ascending: false });

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
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, []);
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
                  {user.username}
                </Text>

                <Menu />
              </View>
              <View style={profilestyles.profileSection}>
                <View style={profilestyles.avatarStatsRow}>
                  <TouchableOpacity style={profilestyles.avatarBorder}>
                    <Image
                      source={
                        user.avatar_url
                          ? { uri: user.avatar_url }
                          : require("../../assets/images/cry.png")
                      }
                      style={profilestyles.avatarImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        margin: 10,
                        marginLeft: 20,
                      }}
                    >
                      {user?.name}
                    </Text>
                    <View style={profilestyles.statsRow}>
                      <View>
                        <Text>59</Text>
                        <Text>followers</Text>
                      </View>
                      <View>
                        <Text>59</Text>
                        <Text>followers</Text>
                      </View>
                      <View>
                        <Text>59</Text>
                        <Text>followers</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <Text>{user?.bio}</Text>
                </View>
                <TouchableOpacity
                  style={profilestyles.editProfileButton}
                  onPress={() => {
                    router.navigate({
                      pathname: "/screens/editprofile",
                      params: { userId: user.id },
                    });
                  }}
                >
                  <Text>Edit Profile</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={profilestyles.storiesRow}
              >
                <View style={profilestyles.highlightItem}>
                  <TouchableOpacity
                    onPress={() => router.navigate("/screens/addHighlight")}
                    style={profilestyles.highlightCircle}
                  >
                    <Feather
                      name="plus"
                      color={"black"}
                      style={profilestyles.addhighlightIcon}
                      size={25}
                    />
                  </TouchableOpacity>
                  <Text>Add</Text>
                </View>

                {highlight.map((item: highlight) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/highlight",
                        params: {
                          image: item.image_url,
                          name: user.username,
                          profile: user.avatar_url,
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
                  params: { userId: user.id, postId: item.id },
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
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  flexOne: {
    flex: 1,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileSection: {
    marginHorizontal: 20,
  },
  avatarStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  avatarBorder: {
    alignItems: "center",
    justifyContent: "center",
  },
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
    borderWidth: 2,
    borderRadius: 4,
    height: 30,
    borderColor: "#dbdbdb",
  },
  storiesRow: {
    flexDirection: "row",
    width: "100%",
    margin: 10,
    gap: 10,
  },
  highlightItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  highlightCircle: {
    height: 65,
    width: 65,
    borderColor: "#b5b5b5",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
  },
  addhighlightIcon: {
    borderColor: "white",
  },

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
    backgroundColor: "blue",
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
  tabIcon: {
    width: 24,
    height: 24,
  },
  gridImage: {
    height: 150,
    width: "100%",
  },
});
