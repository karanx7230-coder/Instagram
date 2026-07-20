import PostItem from "@/app/screens/postItem";
import Postloading from "@/Components/Skeletons/postLoading";
import { supabase } from "@/services/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

type Post = {
  id: string;
  image_url: string;
  caption: string;
  location: string;
  aspect_ratio: number;
};

type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
};

export default function Posts() {
  const { userId, postId } = useLocalSearchParams<{
    userId: string;
    postId: string;
  }>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      if (!userId) return;

      setLoading(false);
      setLoading(true);
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, bio, avatar_url")
          .eq("id", userId)
          .single();

        const { data: userPosts, error } = await supabase
          .from("posts")
          .select("id, image_url, caption, location, aspect_ratio")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error);
        } else if (userPosts) {
          let orderedPosts = [...userPosts];

          if (postId) {
            const targetIndex = orderedPosts.findIndex((p) => p.id === postId);
            if (targetIndex > -1) {
              const [targetPost] = orderedPosts.splice(targetIndex, 1);
              orderedPosts.unshift(targetPost);
            }
          }
          setPosts(orderedPosts);
        }

        setUser({
          id: userId,
          email: "",
          username: profile?.username ?? "",
          name: profile?.full_name ?? "",
          bio: profile?.bio ?? "",
          avatar_url: profile?.avatar_url ?? "",
        });
      } catch (err) {
        console.error("Data fetching lifecycle failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, [userId, postId]);

  if (loading) {
    return <Postloading />;
  }

  const renderPost = ({ item }: { item: Post }) => {
    return (
      <PostItem
        postId={item.id}
        currentUserId={user?.id || ""}
        imageUrl={item.image_url}
        caption={item.caption}
        username={user?.username ?? ""}
        avatarUrl={user?.avatar_url ?? ""}
        aspect={item.aspect_ratio}
      />
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
      />
    </SafeAreaView>
  );
}
