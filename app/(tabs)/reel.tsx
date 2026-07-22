import Reelloading from "@/Components/Skeletons/reelLoading";
import { supabase } from "@/services/supabase";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, StatusBar, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ReelItem from "../screens/reelitem";
import { useUser } from "@/context/UserContext";

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

export default function Reel() {
  const [posts, setPosts] = useState<Post | any>([]);
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const TAB_BAR_HEIGHT = 38;
  const insets = useSafeAreaInsets();
  const ITEM_HEIGHT =
    SCREEN_HEIGHT - insets.top - insets.bottom - TAB_BAR_HEIGHT;
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
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

  if (loading || userLoading || !user) {
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
        itemHeight={ITEM_HEIGHT}
      />
    );
  };
  return (
    <SafeAreaView edges={["top"]} style={{ height: SCREEN_HEIGHT }}>
      <StatusBar barStyle={"light-content"} backgroundColor={"black"} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderreel}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      <View style={{ height: 60 }} />
    </SafeAreaView>
  );
}
