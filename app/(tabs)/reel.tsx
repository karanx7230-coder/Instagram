import Reelloading from "@/Components/Skeletons/reelLoading";
import { supabase } from "@/services/supabase";
import { useEffect, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReelItem from "../screens/reelitem";

const SCREEN_HEIGHT = Dimensions.get("window").height;
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
};
type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
};

export default function Reel() {
  const [posts, setPosts] = useState<Post | any>([]);
  const [user, setUser] = useState<User | any>([]);
  const [loading, setLoading] = useState(false);
  const tabBarHeight = 60;

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        const userresponse = data.user;
        setUser(userresponse);
        const { data: userPosts, error } = await supabase
          .from("posts")
          .select(
            "id, image_url,caption,location,aspect_ratio,profiles(username,avatar_url)",
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.log("posts fetch error", error);
        } else {
          setPosts(userPosts ?? []);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <Reelloading />;
  }

  const renderreel = ({ item }: { item: Post }) => {
    return (
      <ReelItem
        postId={item.id}
        currentUserId={user?.id}
        imageUrl={item.image_url}
        caption={item.caption}
        username={item.profiles?.username}
        avatarUrl={item.profiles?.avatar_url}
        location={item.location}
        aspect={item.aspect_ratio}
      />
    );
  };
  return (
    <SafeAreaView style={{ height: SCREEN_HEIGHT - tabBarHeight }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderreel}
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT - tabBarHeight}
        snapToAlignment="end"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT - tabBarHeight,
          offset: (SCREEN_HEIGHT - tabBarHeight) * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}
