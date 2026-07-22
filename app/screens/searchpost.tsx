import PostItem from "@/app/screens/postItem";
import Postloading from "@/Components/Skeletons/postLoading";
import { supabase } from "@/services/supabase";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useUser } from "@/context/UserContext";
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

export default function SearchPosts() {
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
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
        } else {
          setPosts((allPosts as any) ?? []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, []);

  if (loading || userLoading || !user) {
    return <Postloading />;
  }
  const renderPost = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <PostItem
          postId={item.id}
          currentUserId={user.id}
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
    [user.id, likedPostIds],
  );
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
