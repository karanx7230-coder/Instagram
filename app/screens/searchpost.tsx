import PostItem from "@/app/screens/postItem";
import Postloading from "@/Components/Skeletons/postLoading";
import { supabase } from "@/services/supabase";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useUser } from "@/context/UserContext";

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
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
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
