import PostItem from "@/app/screens/postItem";
import Postloading from "@/Components/Skeletons/postLoading";
import { supabase } from "@/services/supabase";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { FlatList } from "react-native-gesture-handler";
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
  avatar_url: string;
};

export default function Posts() {
  const { userId, postId } = useLocalSearchParams<{
    userId: string;
    postId: string;
  }>();
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, bio, avatar_url")
          .eq("id", userId)
          .single();

        const { data: allPosts, error } = await supabase
          .from("posts")
          .select(
            "id, image_url, caption, location, user_id,aspect_ratio, profiles(username, avatar_url), likes(count)",
          )
          .order("created_at", { ascending: false });
        const { data: userLikes, error: userLikesError } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", currentUser?.id);

        if (!userLikesError && userLikes) {
          setLikedPostIds(new Set(userLikes.map((l) => l.post_id)));
        }

        if (error) {
          console.error("Error fetching posts:", error);
        } else if (allPosts) {
          let orderedPosts = [...allPosts];

          if (postId) {
            const targetIndex = orderedPosts.findIndex((p) => p.id === postId);
            if (targetIndex > -1) {
              const [targetPost] = orderedPosts.splice(targetIndex, 1);
              orderedPosts.unshift(targetPost);
            }
          }
          setPosts(orderedPosts as any);
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

 
 const renderPost = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <PostItem
          postId={item.id}
          currentUserId={currentUser?.id ?? ""}
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
    },
    [currentUser?.id, likedPostIds]
  );
   if (loading) {
    return <Postloading />;
  }
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
