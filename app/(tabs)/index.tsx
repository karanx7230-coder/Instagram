import { ErrorView } from "@/components/common/ErrorView";
import PostItem from "@/components/post/PostItem";
import Homeloading from "@/components/skeletons/FeedLoading";
import { StoryList } from "@/components/story/StoryList";
import { config } from "@/constants/config";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useStories } from "@/hooks/useStories";
import { fetchFeedPosts, fetchLikedPostIds } from "@/services/posts";
import type { Post } from "@/types/post";
import type { Story } from "@/types/story";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user, loading: userLoading } = useUser();
  const { theme } = useTheme();
  const { stories } = useStories();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const hasMoreRef = useRef(true);
  const userId = user?.id;

  const loadInitial = useCallback(async () => {
    if (!userId || busyRef.current) return;
    busyRef.current = true;
    try {
      const [feed, liked] = await Promise.all([
        fetchFeedPosts({ page: 0, pageSize: config.feedPageSize }),
        fetchLikedPostIds(userId),
      ]);
      setLikedPostIds(liked);
      setPosts(feed);
      setPage(0);
      hasMoreRef.current = feed.length === config.feedPageSize;
    } catch (e) {
      console.log("feed load failed", e);
      setError("Couldn't load your feed. Check your connection.");
    } finally {
      busyRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId]);

  useEffect(() => {
    hasMoreRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount; every state update inside loadInitial happens after await
    void loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (!userId || busyRef.current || !hasMoreRef.current) return;
    busyRef.current = true;
    setLoadingMore(true);
    try {
      const feed = await fetchFeedPosts({
        page: page + 1,
        pageSize: config.feedPageSize,
      });
      setPosts((prev) => [...prev, ...feed]);
      setPage((prev) => prev + 1);
      hasMoreRef.current = feed.length === config.feedPageSize;
    } catch (e) {
      console.log("feed load more failed", e);
    } finally {
      busyRef.current = false;
      setLoadingMore(false);
    }
  }, [userId, page]);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    void loadInitial();
  }, [loadInitial]);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <PostItem
          postId={item.id}
          currentUserId={userId ?? ""}
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
    [userId, likedPostIds],
  );

  const openStory = useCallback((story: Story) => {
    router.navigate({
      pathname: "/(modals)/story",
      params: {
        image: story.image,
        id: story.id,
        username: story.username,
        profileimg: story.profileImage,
      },
    });
  }, []);

  const addStory = useCallback(() => {
    router.navigate("/screens/addStory");
  }, []);

  if (loading || userLoading || !user) {
    return <Homeloading />;
  }

  if (error && posts.length === 0) {
    return (
      <SafeAreaView
        style={[homestyles.view, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <ErrorView message={error} onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[homestyles.view, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.background}
      />
      <View style={homestyles.toprow}>
        <TouchableOpacity
          onPress={() => router.navigate("/screens/addPost")}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
        >
          <Feather name="plus" size={24} color={theme.text} />
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          source={require("../../assets/images/Instagram Logo.png")}
          style={homestyles.logo}
        />

        <TouchableOpacity
          onPress={() => router.navigate("/screens/notifications")}
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
        >
          <Feather name="heart" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <StoryList
            stories={stories}
            userAvatarUrl={user.avatar_url}
            onAddStory={addStory}
            onOpenStory={openStory}
          />
        }
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color={theme.tint} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const homestyles = StyleSheet.create({
  view: {
    flex: 1,
  },
  toprow: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconimg: {
    height: 25,
    width: 25,
  },
  logo: {
    height: 33,
    marginLeft: 25,
    alignSelf: "center",
  },
});
