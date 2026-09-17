import { ErrorView } from "@/components/common/ErrorView";
import PostItem from "@/components/post/PostItem";
import Postloading from "@/components/skeletons/PostLoading";
import { config } from "@/constants/config";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { fetchFeedPosts, fetchLikedPostIds } from "@/services/posts";
import type { Post } from "@/types/post";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Posts() {
  const { userId, postId } = useLocalSearchParams<{
    userId: string;
    postId: string;
  }>();
  const { user: currentUser } = useUser();
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const hasMoreRef = useRef(true);
  const currentUserId = currentUser?.id;

  const loadInitial = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const [feed, liked] = await Promise.all([
        fetchFeedPosts({ page: 0, pageSize: config.feedPageSize }),
        currentUserId
          ? fetchLikedPostIds(currentUserId)
          : Promise.resolve<Set<string> | null>(null),
      ]);
      if (liked) setLikedPostIds(liked);
      const ordered = [...feed];
      if (postId) {
        const targetIndex = ordered.findIndex((p) => p.id === postId);
        if (targetIndex > 0) {
          const [target] = ordered.splice(targetIndex, 1);
          ordered.unshift(target);
        }
      }
      setPosts(ordered);
      setPage(0);
      hasMoreRef.current = feed.length === config.feedPageSize;
    } catch (e) {
      console.log("posts load failed", e);
      setError("Couldn't load posts. Check your connection.");
    } finally {
      busyRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [postId, currentUserId]);

  useEffect(() => {
    hasMoreRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount; every state update inside loadInitial happens after await
    void loadInitial();
  }, [userId, postId, loadInitial]);

  const loadMore = useCallback(async () => {
    if (busyRef.current || !hasMoreRef.current) return;
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
      console.log("posts load more failed", e);
    } finally {
      busyRef.current = false;
      setLoadingMore(false);
    }
  }, [page]);

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
          currentUserId={currentUserId ?? ""}
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
    [currentUserId, likedPostIds],
  );

  if (loading) {
    return <Postloading />;
  }

  if (error && posts.length === 0) {
    return (
      <SafeAreaView
        style={{ backgroundColor: theme.background, flex: 1 }}
      >
        <ErrorView message={error} onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
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
    </SafeAreaView>
  );
}
