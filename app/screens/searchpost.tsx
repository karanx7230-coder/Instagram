import { ErrorView } from "@/components/common/ErrorView";
import PostItem from "@/components/post/PostItem";
import Postloading from "@/components/skeletons/PostLoading";
import { config } from "@/constants/config";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { fetchFeedPosts, fetchLikedPostIds } from "@/services/posts";
import type { Post } from "@/types/post";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function SearchPosts() {
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, loading: userLoading } = useUser();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
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
      console.log("search posts load failed", e);
      setError("Couldn't load posts. Check your connection.");
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
      console.log("search posts load more failed", e);
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

  if (loading || userLoading || !user) {
    return <Postloading />;
  }

  if (error && posts.length === 0) {
    return (
      <View style={{ backgroundColor: theme.background, flex: 1 }}>
        <ErrorView message={error} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
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
    </View>
  );
}
