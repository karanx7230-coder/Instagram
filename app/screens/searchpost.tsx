import PostItem from "@/app/screens/postItem";
import Postloading from "@/Components/Skeletons/postLoading";
import { supabase } from "@/services/supabase";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

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
  caption: string;
  location: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
};
export default function SearchPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        const userresponse = data.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, bio, avatar_url")
          .eq("id", userresponse?.id)
          .single();
        const { data: allPosts, error } = await supabase
          .from("posts")
          .select(
            "id, image_url, caption, location, user_id, profiles(username, avatar_url)",
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.log("posts fetch error", error);
        } else {
          setPosts((allPosts as any) ?? []);
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

    fetchdata();
  }, []);
  if (loading) {
    return <Postloading />;
  }
  const renderPost = ({ item }: { item: Post }) => {
    return (
      <PostItem
        postId={item.id}
        currentUserId={user?.id}
        imageUrl={item.image_url}
        caption={item.caption}
        username={user.username}
        avatarUrl={user.avatar_url}
      />
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
