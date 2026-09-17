import { ErrorView } from "@/components/common/ErrorView";
import Reelloading from "@/components/skeletons/ReelLoading";
import { config } from "@/constants/config";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { fetchReels } from "@/services/reels";
import type { Reel as ReelType } from "@/types/reel";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ReelItem from "@/components/reel/ReelItem";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Reel() {
  const [posts, setPosts] = useState<ReelType[]>([]);
  const { user, loading: userLoading } = useUser();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const busyRef = useRef(false);
  const hasMoreRef = useRef(true);
  const userId = user?.id;
  const TAB_BAR_HEIGHT = 38;
  const insets = useSafeAreaInsets();
  const ITEM_HEIGHT =
    SCREEN_HEIGHT - insets.top - insets.bottom - TAB_BAR_HEIGHT;

  const loadInitial = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const reels = await fetchReels({ page: 0, pageSize: config.feedPageSize });
      setPosts(reels);
      setPage(0);
      hasMoreRef.current = reels.length === config.feedPageSize;
    } catch (e) {
      console.log("reels load failed", e);
      setError("Couldn't load reels. Check your connection.");
    } finally {
      busyRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    hasMoreRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount; every state update inside loadInitial happens after await
    void loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (busyRef.current || !hasMoreRef.current) return;
    busyRef.current = true;
    setLoadingMore(true);
    try {
      const reels = await fetchReels({
        page: page + 1,
        pageSize: config.feedPageSize,
      });
      setPosts((prev) => [...prev, ...reels]);
      setPage((prev) => prev + 1);
      hasMoreRef.current = reels.length === config.feedPageSize;
    } catch (e) {
      console.log("reels load more failed", e);
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

  const renderreel = useCallback(
    ({ item }: { item: ReelType }) => {
      return (
        <ReelItem
          postId={item.id}
          currentUserId={userId ?? ""}
          imageUrl={item.image_url}
          caption={item.caption}
          username={item.profiles?.username ?? ""}
          avatarUrl={item.profiles?.avatar_url ?? ""}
          location={item.location}
          aspect={item.aspect_ratio}
          itemHeight={ITEM_HEIGHT}
        />
      );
    },
    [userId, ITEM_HEIGHT],
  );

  if (loading || userLoading || !user) {
    return <Reelloading />;
  }

  if (error && posts.length === 0) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: theme.background }}
      >
        <ErrorView message={error} onRetry={retry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ height: SCREEN_HEIGHT }}>
      <StatusBar barStyle={theme.statusBar} backgroundColor="black" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderreel}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color="#fff" />
          ) : null
        }
      />
      <View style={{ height: 60 }} />
    </SafeAreaView>
  );
}
