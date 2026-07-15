import Postloading from "@/Components/Skeletons/postLoading";
import { supabase } from "@/services/supabase";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
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
export default function posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | any>([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchdata = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const userresponse = data.user;
      console.log(userresponse);
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url")
        .eq("id", userresponse?.id)
        .single();
      console.log(profile);
      const { data: userPosts, error } = await supabase
        .from("posts")
        .select("id, image_url,caption,location")
        .eq("user_id", userresponse?.id)
        .order("created_at", { ascending: false });
      console.log(userPosts);

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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);
  if (loading) {
    return <Postloading />;
  }
  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };
  const renderPost = ({ item }: { item: Post }) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              resizeMode="cover"
              source={{
                uri: user.avatar_url,
              }}
              style={{ height: 35, width: 35, borderRadius: 17 }}
            />

            <TouchableOpacity style={{ marginHorizontal: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: "600" }}>
                {user.username}
              </Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {item.location}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                marginHorizontal: 10,
                paddingHorizontal: 15,
                height: 30,
                backgroundColor: "#e9e9e9",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
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
          onMagicTap={() => toggleLike(item.id)}
          source={{
            uri: item.image_url,
          }}
          //    images[index]?.download_url ||
          style={{ width: "100%", height: 400 }}
        />
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => toggleLike(item.id)}>
              {likedPosts.has(item.id) ? (
                <Image
                  source={require("../../assets/images/redheart.png")}
                  resizeMode="contain"
                  style={{ height: 30, width: 30 }}
                />
              ) : (
                <Feather name="heart" size={24} />
              )}
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
                style={{ height: 25, width: 25 }}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/Messanger.png")}
                style={{ height: 25, width: 25 }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Feather name="bookmark" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            gap: 10,
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            source={require("../../assets/images/Inner Oval.png")}
            style={{ height: 25, width: 25 }}
          />
        </View>

        <View style={{ marginHorizontal: 10, marginTop: 5 }}>
          <Text numberOfLines={2} style={{ fontSize: 13, lineHeight: 18 }}>
            <Text style={{ fontWeight: "bold" }}>{user.firstName}</Text>
            {"  "}
            {item.caption}
          </Text>
          <Text style={{ color: "#666", marginTop: 3 }}>
            {(1000 + Math.random() * 100).toFixed(0)} views
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
      />
    </View>
  );
}
